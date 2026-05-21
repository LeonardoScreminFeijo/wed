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

  lista.forEach(({ adultos_sim = 0, adultos_nao = 0, criancas_sim = 0 }) => {
    totalAdultosSim  += Number(adultos_sim);
    totalAdultosNao  += Number(adultos_nao);
    totalCriancasSim += Number(criancas_sim);
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

  const linhas = lista.map(({ usuario, timestamp, adultos_sim, adultos_nao, criancas_sim, nomes, mensagem }) => `
    <tr>
      <td>${texto(usuario)}</td>
      <td>${texto(timestamp)}</td>
      <td>${Number(adultos_sim) || 0}</td>
      <td>${Number(adultos_nao) || 0}</td>
      <td>${Number(criancas_sim) || 0}</td>
      <td>${texto(nomes)}</td>
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
            <th>Login</th>
            <th>Data</th>
            <th>Adultos Sim</th>
            <th>Adultos Não</th>
            <th>Crianças</th>
            <th>Nomes</th>
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
  const cabecalho = ["Login", "Data", "Adultos Sim", "Adultos Não", "Crianças", "Nomes", "Mensagem"];
  const linhas = lista.map(({ usuario, timestamp, adultos_sim, adultos_nao, criancas_sim, nomes, mensagem }) =>
    [usuario, timestamp, adultos_sim, adultos_nao, criancas_sim, nomes, mensagem]
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
