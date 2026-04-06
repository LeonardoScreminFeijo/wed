import { protegerPagina } from "./login.js";

export function iniciarRSVP() {
  const form = document.getElementById("form-rsvp");
  if (!form) return;

  if (!protegerPagina()) return;

  const inputNome = document.getElementById("nome");
  if (inputNome) {
    inputNome.addEventListener("input", function () {
      this.value = this.value.replace(
        /[^a-zA-ZáàâãéêíïóôõöúçñÁÀÂÃÉÊÍÏÓÔÕÖÚÇÑ\s]/g,
        "",
      );
    });
  }

  const scriptURL = import.meta.env.API_URL_RSVP;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const btnSubmit = document.querySelector(".btn-submit");
    const textoOriginal = btnSubmit.innerText;

    btnSubmit.innerText = "Enviando...";
    btnSubmit.disabled = true;

    const formData = new FormData(form);
    fetch(scriptURL, {
      method: "POST",
      body: formData,
      mode: "no-cors",
    })
      .then(() => {
        alert("Presença confirmada com sucesso! Muito obrigado.");
        form.reset();
        btnSubmit.innerText = textoOriginal;
        btnSubmit.disabled = false;
      })
      .catch((error) => {
        console.error("Erro!", error.message);
        alert("Ops! Houve um erro ao enviar. Tente novamente.");
        btnSubmit.innerText = textoOriginal;
        btnSubmit.disabled = false;
      });
  });
}
