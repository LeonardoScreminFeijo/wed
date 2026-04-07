import { protegerPagina } from "./login.js";
import { dispararConfetes } from "./confetti.js";
import { mostrarSucesso, mostrarErro } from "./toast.js";

export function iniciarRSVP() {
  const form = document.getElementById("form-rsvp");
  if (!form) return;
  if (!protegerPagina()) return;

  const inputAdultos = document.getElementById("adultos");
  const inputCriancas = document.getElementById("criancas");
  const container = document.getElementById("convidados-container");
  const scriptURL = import.meta.env.VITE_API_URL_RSVP;

  // Função que constrói os campos dinamicamente
  function renderizarConvidados() {
    const numAdultos = parseInt(inputAdultos.value) || 0;
    const numCriancas = parseInt(inputCriancas.value) || 0;
    let html = "";

    // Gera os campos dos Adultos
    for (let i = 1; i <= numAdultos; i++) {
      html += `
        <div class="convidado-card">
            <h4>Adulto ${i} ${i === 1 ? "(Titular)" : ""}</h4>
            
            <div class="input-group">
                <label>Nome Completo&nbsp*</label>
                <input type="text" name="nome_adulto_${i}" required placeholder="Ex: João da Silva">
            </div>

            <div class="input-group radio-group">
                <p class="radio-title">Você poderá comparecer?&nbsp*</p>
                <label class="radio-label">
                    <input type="radio" name="presenca_adulto_${i}" value="Sim" required />
                    <span>Sim, vai festejar conosco! 🎈</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="presenca_adulto_${i}" value="Não" />
                    <span>Infelizmente não poderei ir 😔</span>
                </label>
            </div>

            ${
              i === 1
                ? `
            <div class="input-group">
                <label>Deixe uma mensagem para os noivos (Opcional)</label>
                <textarea name="mensagem_titular" rows="3" placeholder="Escreva algo carinhoso..."></textarea>
            </div>
            `
                : ""
            }
        </div>
      `;
    }

    // Gera os campos das Crianças
    for (let i = 1; i <= numCriancas; i++) {
      html += `
        <div class="convidado-card">
            <h4>Criança ${i} (Até 10 anos)</h4>
            
            <div class="input-group">
                <label>Nome da Criança&nbsp</label>
                <input type="text" name="nome_crianca_${i}" required placeholder="Ex: Maria da Silva">
            </div>

            <div class="input-group radio-group">
                <p class="radio-title">A criança irá comparecer?&nbsp</p>
                <label class="radio-label">
                    <input type="radio" name="presenca_crianca_${i}" value="Sim" required />
                    <span>Sim, vai festejar conosco! 🎈</span>
                </label>
                <label class="radio-label">
                    <input type="radio" name="presenca_crianca_${i}" value="Não" />
                    <span>Infelizmente não poderei ir 😔</span>
                </label>
            </div>
        </div>
      `;
    }

    container.innerHTML = html;
  }

  // Ouve quando os números mudam e reconstrói a tela
  inputAdultos.addEventListener("input", renderizarConvidados);
  inputCriancas.addEventListener("input", renderizarConvidados);

  // Roda a função uma vez ao abrir a página para desenhar o Adulto 1
  renderizarConvidados();

  // O Envio do formulário
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
        dispararConfetes();
        mostrarSucesso("Presenças confirmadas com sucesso! Muito obrigado.");
        form.reset();
        renderizarConvidados(); // Reseta os cartões visuais também
      })
      .catch((error) => {
        console.error("Erro!", error.message);
        mostrarErro("Ops! Houve um erro ao enviar. Tente novamente.");
      })
      .finally(() => {
        btnSubmit.innerText = textoOriginal;
        btnSubmit.disabled = false;
      });
  });
}
