import { dispararConfetes } from "./confetti.js";

const pixChaves = {
  teste: import.meta.env.VITE_PIX_TESTE,
  jantar: import.meta.env.VITE_PIX_TESTE,
  sofa: import.meta.env.VITE_PIX_TESTE,
};

document.addEventListener("DOMContentLoaded", () => {
  const botoesPix = document.querySelectorAll(".btn-copiar-pix");

  botoesPix.forEach((botao) => {
    botao.addEventListener("click", async () => {
      const item = botao.getAttribute("data-item");

      const codigoPix = pixChaves[item];

      const textoOriginal = botao.querySelector(".btn-texto").innerText;

      if (!codigoPix) {
        alert("Chave PIX não configurada para este item.");
        console.error(
          `Faltou configurar VITE_PIX_${item.toUpperCase()} no .env`,
        );
        return;
      }

      try {
        await navigator.clipboard.writeText(codigoPix);

        dispararConfetes();

        botao.classList.add("copiado");
        botao.querySelector(".btn-texto").innerText = "✔ Copiado!";

        setTimeout(() => {
          botao.classList.remove("copiado");
          botao.querySelector(".btn-texto").innerText = textoOriginal;
        }, 3000);
      } catch (err) {
        console.error("Falha ao copiar PIX: ", err);
        alert(
          "Não foi possível copiar automaticamente. Selecione o código manualmente: " +
            codigoPix,
        );
      }
    });
  });
});
