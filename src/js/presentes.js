import { dispararConfetes } from "./confetti.js";
import { isTestUser } from "./login.js";
import { mostrarErro } from "./toast.js";
import { Logger } from "./logger.js";

const pixChaves = {
  passagem: import.meta.env.VITE_PIX_TESTE,
  branco: import.meta.env.VITE_PIX_TESTE,
  dj: import.meta.env.VITE_PIX_TESTE,
  pobre: import.meta.env.VITE_PIX_TESTE,
  bebado: import.meta.env.VITE_PIX_TESTE,
  mira_buque: import.meta.env.VITE_PIX_TESTE,
  bagagem: import.meta.env.VITE_PIX_TESTE,
};

document.addEventListener("DOMContentLoaded", () => {
  const botoesPix = document.querySelectorAll(".btn-copiar-pix");

  botoesPix.forEach((botao) => {
    botao.addEventListener("click", async () => {
      const item = botao.getAttribute("data-item");

      const codigoPix = pixChaves[item];

      const textoOriginal = botao.querySelector(".btn-texto").innerText;

      if (!codigoPix) {
        mostrarErro("Chave PIX não configurada para este item.");
        console.error(
          `Faltou configurar VITE_PIX_${item.toUpperCase()} no .env`,
        );
        return;
      }

      try {
        if (!isTestUser()) {
          await navigator.clipboard.writeText(codigoPix);
        }
        Logger.info("PIX_COPIADO", { presente: item });
        dispararConfetes();

        botao.classList.add("copiado");
        botao.querySelector(".btn-texto").innerText = isTestUser()
          ? "✔ Copiado! (Teste)"
          : "✔ Copiado!";

        setTimeout(() => {
          botao.classList.remove("copiado");
          botao.querySelector(".btn-texto").innerText = textoOriginal;
        }, 3000);
      } catch (err) {
        console.error("Falha ao copiar PIX: ", err);
        mostrarErro(
          "Não foi possível copiar automaticamente. Selecione o código manualmente: " +
            codigoPix,
        );
      }
    });
  });
});
