import { obterUsuario } from "./login.js";
import { mostrarErro, mostrarSucesso } from "./toast.js";

const API_RSVP  = import.meta.env.VITE_API_URL_ADMIN_RSVP;
const API_MURAL = import.meta.env.VITE_API_URL_MURAL;

export function iniciarAdmin() {
  carregarRsvps();
  carregarMural();
}

// ==========================================
// RSVP
// ==========================================
async function carregarRsvps() {
  const secaoStats  = document.getElementById("admin-stats");
  const secaoTabela = document.getElementById("admin-rsvp-tabela");

  if (!API_RSVP) {
    secaoStats.innerHTML  = `<p class="admin-aviso">Configure <code>VITE_API_URL_ADMIN_RSVP</code> no .env para ver os dados de presença.</p>`;
    secaoTabela.innerHTML = "";
    return;
  }

  secaoTabela.innerHTML = `<p class="admin-carregando">Carregando confirmações...</p>`;

  try {
    const res   = await fetch(API_RSVP);
    const dados = await res.json();
    const lista = dados.confirmacoes || [];

    renderizarStats(lista, secaoStats);
    renderizarTabela(lista, secaoTabela);
  } catch {
    secaoTabela.innerHTML = `<p class="admin-aviso">Erro ao carregar dados de presença.</p>`;
  }
}

function renderizarStats(lista, el) {
  let totalAdultosSim = 0, totalAdultosNao = 0, totalCriancasSim = 0;

  lista.forEach(({ adulto, crianca, presenca }) => {
    if (adulto  && presenca === "Sim") totalAdultosSim++;
    if (adulto  && presenca === "Não") totalAdultosNao++;
    if (crianca && presenca === "Sim") totalCriancasSim++;
  });

  el.innerHTML = `
    <div class="admin-stat-card">
      <span class="stat-numero">${totalAdultosSim}</span>
      <span class="stat-label">Adultos Confirmados</span>
    </div>
    <div class="admin-stat-card stat-ausencia">
      <span class="stat-numero">${totalAdultosNao}</span>
      <span class="stat-label">Adultos Ausentes</span>
    </div>
    <div class="admin-stat-card">
      <span class="stat-numero">${totalCriancasSim}</span>
      <span class="stat-label">Crianças Confirmadas</span>
    </div>
    <div class="admin-stat-card stat-total">
      <span class="stat-numero">${totalAdultosSim + totalCriancasSim}</span>
      <span class="stat-label">Total Esperado</span>
    </div>
  `;
}

function renderizarTabela(lista, el) {
  if (lista.length === 0) {
    el.innerHTML = `<p class="admin-aviso">Nenhuma confirmação recebida ainda.</p>`;
    return;
  }

  const linhas = lista.map(({ timestamp, nome, adulto, crianca, presenca, mensagem }) => `
    <tr>
      <td>${texto(nome)}</td>
      <td>${adulto ? "Adulto" : "Criança"}</td>
      <td class="${presenca === "Sim" ? "presenca-sim" : "presenca-nao"}">${texto(presenca)}</td>
      <td>${texto(formatarData(timestamp))}</td>
      <td class="td-mensagem">${texto(mensagem)}</td>
    </tr>
  `).join("");

  el.innerHTML = `
    <div class="admin-tabela-header">
      <button class="btn-exportar" id="btn-exportar-csv">Exportar CSV</button>
    </div>
    <div class="admin-tabela-scroll">
      <table class="admin-table" id="tabela-rsvp">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Presença</th>
            <th>Data</th>
            <th>Mensagem</th>
          </tr>
        </thead>
        <tbody>${linhas}</tbody>
      </table>
    </div>
  `;

  document.getElementById("btn-exportar-csv").addEventListener("click", () => exportarCSV(lista));
}

function exportarCSV(lista) {
  const cabecalho = ["Nome", "Tipo", "Presença", "Data", "Mensagem"];
  const linhas = lista.map(({ timestamp, nome, adulto, presenca, mensagem }) =>
    [nome, adulto ? "Adulto" : "Criança", presenca, formatarData(timestamp), mensagem]
      .map(v => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );

  const csv  = [cabecalho.join(","), ...linhas].join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `rsvp-casamento-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  mostrarSucesso("CSV exportado com sucesso!");
}

function formatarData(ts) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (isNaN(d)) return String(ts);
  return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// ==========================================
// MURAL
// ==========================================
async function carregarMural() {
  const grid = document.getElementById("admin-mural-grid");
  grid.innerHTML = `<p class="admin-carregando">Carregando mensagens...</p>`;

  try {
    const res   = await fetch(API_MURAL);
    const dados = await res.json();
    let recados = dados.recados || [];

    renderizarMural(recados, grid);
  } catch {
    grid.innerHTML = `<p class="admin-aviso">Erro ao carregar o mural.</p>`;
  }
}

function renderizarMural(recados, grid) {
  if (recados.length === 0) {
    grid.innerHTML = `<p class="admin-aviso">Nenhum recado ainda.</p>`;
    return;
  }

  grid.innerHTML = "";

  recados.forEach((recado) => {
    const card = document.createElement("div");
    card.className = "mural-card";

    const pTexto = document.createElement("p");
    pTexto.className = "mural-texto";
    pTexto.textContent = `"${recado.texto}"`;

    const pAutor = document.createElement("p");
    pAutor.className = "mural-autor";
    pAutor.textContent = `— ${recado.autor}`;

    const btn = document.createElement("button");
    btn.className = "btn-apagar-mensagem";
    btn.dataset.id = recado.id;
    btn.title = "Excluir recado";
    btn.textContent = "🗑️";
    btn.addEventListener("click", async () => {
      if (!confirm("Apagar esta mensagem para todos?")) return;
      btn.textContent = "⏳";
      btn.disabled = true;
      try {
        const res = await fetch(`${API_MURAL}?id=${recado.id}&user=${obterUsuario()}`, { method: "DELETE" });
        if (res.ok) {
          card.remove();
          mostrarSucesso("Mensagem apagada.");
        } else {
          mostrarErro("Erro ao apagar.");
          btn.textContent = "🗑️";
          btn.disabled = false;
        }
      } catch {
        mostrarErro("Erro de conexão.");
        btn.textContent = "🗑️";
        btn.disabled = false;
      }
    });

    card.appendChild(pTexto);
    card.appendChild(pAutor);
    card.appendChild(btn);
    grid.appendChild(card);
  });
}

function texto(v) {
  return String(v ?? "—");
}

iniciarAdmin();
