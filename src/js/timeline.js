export function iniciarTimeline() {
  const timelineItems = document.querySelectorAll(".timeline-item");
  const storyDisplay = document.getElementById("story-display");
  const timelineTrack = document.querySelector(".timeline-track");

  // --- Elementos do Scroll ---
  const wrapper = document.getElementById("timeline-wrapper");
  const setaEsquerda = document.getElementById("seta-esquerda");
  const setaDireita = document.getElementById("seta-direita");

  if (!timelineTrack || !storyDisplay) return;

  const storyTitle = storyDisplay.querySelector("h3");
  const storyTextElement = storyDisplay.querySelector("p");

  // Lógica das fotos (já existia)
  timelineItems.forEach((item) => {
    item.addEventListener("click", () => {
      const jaEstavaAtivo = item.classList.contains("active");

      timelineItems.forEach((i) => i.classList.remove("active"));

      if (jaEstavaAtivo) {
        timelineTrack.classList.remove("has-active");
        storyDisplay.classList.remove("active");

        setTimeout(() => {
          if (storyTitle) storyTitle.style.display = "block";
          if (storyTextElement) storyTextElement.innerText = "";
        }, 300);
      } else {
        item.classList.add("active");
        timelineTrack.classList.add("has-active");

        const storyText = item.getAttribute("data-story");
        if (storyTextElement) storyTextElement.innerText = storyText;
        if (storyTitle) storyTitle.style.display = "none";

        storyDisplay.classList.add("active");
      }
    });
  });

  // --- LÓGICA DAS SETAS INTELIGENTES ---
  if (wrapper && setaEsquerda && setaDireita) {
    const atualizarSetas = () => {
      // 1. Se não houver scroll possível (ex: Tela grande de PC), esconde as duas!
      if (wrapper.scrollWidth <= wrapper.clientWidth) {
        setaEsquerda.classList.remove("visivel");
        setaDireita.classList.remove("visivel");
        return;
      }

      // 2. Controla a Seta Esquerda
      if (wrapper.scrollLeft > 10) {
        setaEsquerda.classList.add("visivel"); // Arrastou para o lado, a seta aparece
      } else {
        setaEsquerda.classList.remove("visivel"); // Está no início, a seta some
      }

      // 3. Controla a Seta Direita (com margem de erro de 2px para garantir)
      if (wrapper.scrollLeft + wrapper.clientWidth >= wrapper.scrollWidth - 2) {
        setaDireita.classList.remove("visivel"); // Chegou no fim da história, a seta some
      } else {
        setaDireita.classList.add("visivel"); // Tem história para a frente, a seta aparece
      }
    };

    // Fica de olho quando o usuário arrasta o dedo ou vira o celular de lado
    wrapper.addEventListener("scroll", atualizarSetas);
    window.addEventListener("resize", atualizarSetas);

    // Roda a verificação assim que a página abre
    setTimeout(atualizarSetas, 100);

    // Permite que clicar na seta mova a tela automaticamente e com suavidade
    setaEsquerda.addEventListener("click", () => {
      wrapper.scrollBy({ left: -250, behavior: "smooth" });
    });

    setaDireita.addEventListener("click", () => {
      wrapper.scrollBy({ left: 250, behavior: "smooth" });
    });
  }
}
