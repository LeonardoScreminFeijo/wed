import { protegerPagina, obterUsuario, isNoivos, isTestUser } from "./login.js";
import { mostrarSucesso, mostrarErro } from "./toast.js";

const API_URL = import.meta.env.VITE_API_URL_MURAL;

export function iniciarMural() {
  const formMural = document.getElementById("form-mural");
  const muralGrid = document.getElementById("mural-grid");

  if (!formMural || !muralGrid) return;
  if (!protegerPagina()) return;

  if (isTestUser()) {
    const aviso = document.createElement("p");
    aviso.innerHTML =
      "<strong>⚠️ Modo Teste Ativo:</strong> Sua mensagem aparecerá por 5 segundos e não será salva no banco oficial.";
    aviso.style.color = "#d97706";
    aviso.style.fontSize = "0.9rem";
    aviso.style.textAlign = "center";
    aviso.style.marginBottom = "15px";
    formMural.prepend(aviso);
  }

  let recados = [];

  async function carregarRecadosDaNuvem() {
    try {
      muralGrid.innerHTML =
        '<p style="text-align:center; width:100%; font-style:italic;">Carregando mensagens com muito amor... ❤️</p>';

      const resposta = await fetch(API_URL);

      if (resposta.ok) {
        const dados = await resposta.json();
        recados = dados.recados || [];
        renderizarRecados();
      } else {
        muralGrid.innerHTML =
          '<p style="text-align:center; color:var(--color-wine);">Erro ao carregar o mural da nuvem.</p>';
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      muralGrid.innerHTML =
        '<p style="text-align:center; color:#555;">Falha de conexão com o banco de dados.</p>';
    }
  }

  // =========================================
  // RENDERIZAÇÃO NA TELA
  // =========================================
  function renderizarRecados() {
    muralGrid.innerHTML = "";

    if (recados.length === 0) {
      muralGrid.innerHTML =
        '<p style="text-align:center; width: 100%; font-style:italic;">Nenhum recado ainda. Seja o primeiro!</p>';
      return;
    }

    recados.forEach((recado) => {
      const card = document.createElement("div");
      card.className = "mural-card";

      card.innerHTML = `
        <p class="mural-texto">"${recado.texto}"</p>
        <p class="mural-autor">— ${recado.autor}</p>
        <button class="btn-apagar-mensagem" data-id="${recado.id}" title="Excluir recado para TODOS">🗑️</button>
      `;

      muralGrid.appendChild(card);
    });

    ativarBotoesExclusao();
  }

  // =========================================
  // 2. EXCLUIR MENSAGEM DA NUVEM (DELETE)
  // =========================================
  function ativarBotoesExclusao() {
    const botoesLixeira = muralGrid.querySelectorAll(".btn-apagar-mensagem");

    botoesLixeira.forEach((botao) => {
      botao.addEventListener("click", async function () {
        const idParaApagar = this.getAttribute("data-id");

        if (
          confirm(
            "🚨 Atenção: Tem certeza que deseja apagar esta mensagem para TODOS os convidados?",
          )
        ) {
          try {
            this.innerText = "⏳";
            this.disabled = true;

            const usuarioLogado = obterUsuario();

            const resposta = await fetch(
              `${API_URL}?id=${idParaApagar}&user=${usuarioLogado}`,
              {
                method: "DELETE",
              },
            );

            if (resposta.ok) {
              recados = recados.filter((recado) => recado.id !== idParaApagar);
              renderizarRecados();
            } else {
              mostrarErro(
                "A nuvem bloqueou a exclusão. Apenas noivos podem fazer isso!",
              );
              renderizarRecados();
            }
          } catch (erro) {
            mostrarErro("Erro de conexão ao tentar apagar na nuvem.");
            renderizarRecados();
          }
        }
      });
    });
  }

  carregarRecadosDaNuvem();

  // =========================================
  // 3. ENVIAR NOVA MENSAGEM (POST)
  // =========================================
  formMural.addEventListener("submit", async function (event) {
    event.preventDefault();

    const btnSubmit = document.querySelector(".btn-submit");
    const textoOriginal = btnSubmit.innerText;
    const inputAssinatura = document.getElementById("assinatura-mural");
    const inputMensagem = document.getElementById("mensagem-mural");

    btnSubmit.innerText = "Salvando na Nuvem...";
    btnSubmit.disabled = true;

    // Criamos o objeto que vai para a nuvem
    const novoRecado = {
      id: Date.now().toString(),
      autor: inputAssinatura.value.trim(),
      texto: inputMensagem.value.trim(),
      usuario: obterUsuario(),
    };

    if (isTestUser()) {
      setTimeout(() => {
        recados.unshift(novoRecado);
        renderizarRecados();
        mostrarSucesso("[TESTE] Mensagem enviada ❤️");
        formMural.reset();

        btnSubmit.innerText = textoOriginal;
        btnSubmit.disabled = false;

        setTimeout(() => {
          recados = recados.filter((r) => r.id !== novoRecado.id);
          renderizarRecados();
        }, 5000);
      }, 500);
      return;
    }

    try {
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoRecado),
      });

      if (resposta.ok) {
        recados.unshift(novoRecado);
        renderizarRecados();
        mostrarSucesso("Mensagem enviada com sucesso aos noivos ❤️");
        formMural.reset();
      } else {
        mostrarErro("Erro na nuvem ao tentar salvar o recado.");
      }
    } catch (error) {
      console.error("Erro ao enviar recado", error);
      mostrarErro("Ops! Houve um erro de conexão com o banco de dados.");
    } finally {
      btnSubmit.innerText = textoOriginal;
      btnSubmit.disabled = false;
    }
  });
}
