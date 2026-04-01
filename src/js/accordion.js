export function iniciarSanfona() {
  const botoes = document.querySelectorAll(".accordion-header");

  if (botoes.length === 0) return;

  botoes.forEach((botao) => {
    botao.addEventListener("click", () => {
      const conteudo = botao.nextElementSibling;

      const jaEstaAberto = botao.classList.contains("active");

      document.querySelectorAll(".accordion-header").forEach((b) => {
        b.classList.remove("active");
        b.nextElementSibling.classList.remove("active");
        b.nextElementSibling.style.maxHeight = null;
      });

      if (!jaEstaAberto) {
        botao.classList.add("active");
        conteudo.classList.add("active");

        conteudo.style.maxHeight = conteudo.scrollHeight + 40 + "px";
      }
    });
  });
}
