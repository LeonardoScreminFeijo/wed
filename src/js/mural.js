import { protegerPagina, obterUsuario } from "./login.js";

export function iniciarMural() {
  const formMural = document.getElementById("form-mural");
  const muralGrid = document.getElementById("mural-grid");

  if (!formMural || !muralGrid) return;
  if (!protegerPagina()) return;

  let recados = [];

  function renderizarRecados() {
    muralGrid.innerHTML = "";
    recados.forEach((recado) => {
      const card = document.createElement("div");
      card.className = "mural-card";
      card.innerHTML = `
        <p class="mural-texto">"${recado.texto}"</p>
        <p class="mural-autor">— ${recado.autor}</p>
      `;
      muralGrid.appendChild(card);
    });
  }
  renderizarRecados();

  formMural.addEventListener("submit", async function (event) {
    event.preventDefault();

    const btnSubmit = document.querySelector(".btn-submit");
    const textoOriginal = btnSubmit.innerText;

    const inputAssinatura = document.getElementById("assinatura-mural");
    const inputMensagem = document.getElementById("mensagem-mural");

    btnSubmit.innerText = "Enviando...";
    btnSubmit.disabled = true;

    const novoRecado = {
      autor: inputAssinatura.value.trim(),
      texto: inputMensagem.value.trim(),
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      recados.unshift(novoRecado);
      renderizarRecados();

      alert("Recado enviado com sucesso! Ele já está no nosso mural.");
      formMural.reset();
    } catch (error) {
      console.error("Erro ao enviar recado", error);
      alert("Ops! Houve um erro ao enviar. Tente novamente.");
    } finally {
      btnSubmit.innerText = textoOriginal;
      btnSubmit.disabled = false;
    }
  });
}
