import { dispararConfetes } from "./confetti.js";
import { isTestUser } from "./login.js";
import { mostrarErro, mostrarSucesso } from "./toast.js";
import { Logger } from "./logger.js";

const PUBLIC_KEY = import.meta.env.VITE_MP_PUBLIC_KEY;

let sdkPromise = null;
let brickController = null;

function carregarSdk() {
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    if (window.MercadoPago) {
      resolve(window.MercadoPago);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.onload = () => resolve(window.MercadoPago);
    script.onerror = () => reject(new Error("Falha ao carregar SDK do Mercado Pago"));
    document.head.appendChild(script);
  });
  return sdkPromise;
}

function criarModal() {
  if (document.getElementById("modal-pagamento")) return;

  const modal = document.createElement("div");
  modal.id = "modal-pagamento";
  modal.className = "login-modal-overlay";
  modal.innerHTML = `
    <div class="login-modal-card mp-modal-card" role="dialog" aria-modal="true">
      <button class="login-modal-fechar" id="btn-fechar-modal-pagamento" aria-label="Fechar">✕</button>
      <div class="login-modal-header">
        <p class="login-modal-subtitulo" id="mp-item-titulo"></p>
      </div>
      <div id="mp-resultado" class="mp-resultado" hidden></div>
      <div id="paymentBrick_container"></div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) fecharModal();
  });
  document
    .getElementById("btn-fechar-modal-pagamento")
    .addEventListener("click", fecharModal);
}

function fecharModal() {
  const modal = document.getElementById("modal-pagamento");
  if (!modal) return;
  modal.classList.remove("active");
  if (brickController) {
    brickController.unmount();
    brickController = null;
  }
  document.getElementById("paymentBrick_container").innerHTML = "";
  document.getElementById("mp-resultado").hidden = true;
}

function mostrarResultadoPix(pontoInteracao) {
  const dados = pontoInteracao?.transaction_data;
  if (!dados) return;

  const container = document.getElementById("mp-resultado");
  container.hidden = false;
  container.innerHTML = `
    <p>Escaneie o QR Code ou copie o código Pix:</p>
    <img src="data:image/png;base64,${dados.qr_code_base64}" alt="QR Code Pix" />
    <button class="btn-copiar-pix" id="btn-copiar-pix-mp">
      <span class="btn-texto">Copiar código Pix</span>
    </button>
  `;
  document.getElementById("paymentBrick_container").hidden = true;

  document.getElementById("btn-copiar-pix-mp").addEventListener("click", async () => {
    await navigator.clipboard.writeText(dados.qr_code);
    mostrarSucesso("Código Pix copiado!");
  });
}

async function renderizarBrick(item, valor, titulo) {
  const MercadoPago = await carregarSdk();
  const mp = new MercadoPago(PUBLIC_KEY, { locale: "pt-BR" });
  const bricksBuilder = mp.bricks();

  document.getElementById("mp-item-titulo").innerText = titulo;
  document.getElementById("paymentBrick_container").hidden = false;

  brickController = await bricksBuilder.create("payment", "paymentBrick_container", {
    initialization: { amount: valor },
    customization: {
      paymentMethods: { creditCard: "all", bankTransfer: "all" },
    },
    callbacks: {
      onReady: () => {},
      onError: (erro) => {
        Logger.error("MP_BRICK_ERRO", erro, { item });
        mostrarErro("Erro ao carregar o formulário de pagamento.");
      },
      onSubmit: ({ selectedPaymentMethod, formData }) => {
        if (isTestUser()) {
          Logger.info("MP_PAGAMENTO_TESTE", { item, metodo: selectedPaymentMethod });
          mostrarSucesso("Pagamento simulado com sucesso! (Modo Teste)");
          dispararConfetes();
          fecharModal();
          return Promise.resolve();
        }

        return fetch("/api/mp-criar-pagamento", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ item, valor, selectedPaymentMethod, formData }),
        })
          .then((resposta) => resposta.json())
          .then((resultado) => {
            if (!resultado.sucesso) {
              mostrarErro(resultado.mensagem || "Não foi possível processar o pagamento.");
              return;
            }

            Logger.info("MP_PAGAMENTO_ENVIADO", {
              item,
              metodo: selectedPaymentMethod,
              status: resultado.status,
            });

            if (selectedPaymentMethod === "bank_transfer") {
              mostrarResultadoPix(resultado.point_of_interaction);
            } else if (resultado.status === "approved") {
              mostrarSucesso("Pagamento aprovado! Muito obrigado 💛");
              dispararConfetes();
              fecharModal();
            } else {
              mostrarErro("Pagamento não aprovado. Tente outro cartão.");
            }
          })
          .catch((erro) => {
            Logger.error("MP_PAGAMENTO_FALHOU", erro, { item });
            mostrarErro("Não foi possível processar o pagamento. Tente novamente.");
          });
      },
    },
  });
}

export function abrirModalPagamento(item, valor, titulo) {
  criarModal();
  const modal = document.getElementById("modal-pagamento");
  modal.classList.add("active");
  renderizarBrick(item, valor, titulo).catch((erro) => {
    Logger.error("MP_SDK_FALHOU", erro, { item });
    mostrarErro("Não foi possível carregar o pagamento. Tente novamente mais tarde.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const botoesPagar = document.querySelectorAll(".btn-pagar-mp");

  botoesPagar.forEach((botao) => {
    botao.addEventListener("click", () => {
      const item = botao.getAttribute("data-item");
      const titulo = botao.getAttribute("data-titulo");

      if (botao.getAttribute("data-livre") === "true") {
        const input = document.getElementById("input-pix-livre");
        const valorLivre = parseFloat(input.value.replace(",", "."));
        const minimo = parseFloat(input.getAttribute("min"));

        if (!Number.isFinite(valorLivre) || valorLivre < minimo) {
          mostrarErro(`Digite um valor de no mínimo R$ ${minimo.toFixed(2)}.`);
          input.focus();
          return;
        }

        abrirModalPagamento(item, valorLivre, titulo);
        return;
      }

      const valor = parseFloat(botao.getAttribute("data-valor"));
      abrirModalPagamento(item, valor, titulo);
    });
  });
});
