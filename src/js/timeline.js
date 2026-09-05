export function iniciarTimeline() {
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineTrack = document.getElementById("timeline-track");

  if (!timelineTrack || !timelineItems.length) return;

  function fecharTodos() {
    timelineItems.forEach((i) => i.classList.remove("active"));
    timelineTrack.classList.remove("has-active");
  }

  timelineItems.forEach((item) => {
    // Monta a caixa de diálogo a partir do texto daquele momento
    const foto = item.querySelector(".timeline-content");
    if (!foto) return;

    const texto = item.getAttribute("data-story");
    if (texto && !foto.querySelector(".item-dialog")) {
      const dialog = document.createElement("div");
      dialog.className = "item-dialog";
      dialog.setAttribute("role", "status");
      const p = document.createElement("p");
      p.textContent = texto;
      dialog.appendChild(p);
      foto.appendChild(dialog);
    }

    // Só o toque (dedo/caneta) fixa a caixa. No desktop com mouse o texto
    // aparece apenas no hover (via CSS) — clique não fixa nada.
    foto.addEventListener("pointerup", (evento) => {
      if (evento.pointerType === "mouse") return;

      const jaEstavaAtivo = item.classList.contains("active");
      fecharTodos();

      if (!jaEstavaAtivo) {
        item.classList.add("active");
        timelineTrack.classList.add("has-active");
      }
    });
  });

  // Tocar fora da linha do tempo fecha a caixa aberta
  document.addEventListener("pointerup", (evento) => {
    if (evento.pointerType === "mouse") return;
    if (evento.target.closest(".timeline-item")) return;
    fecharTodos();
  });
}
