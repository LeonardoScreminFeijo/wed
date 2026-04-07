export function configurarBotaoCalendario() {
  const btnCalendario = document.getElementById("btn-calendario");

  if (!btnCalendario) return;

  btnCalendario.addEventListener("click", (event) => {
    event.preventDefault();

    const titulo = "Casamento Ana & Léo";
    const detalhes =
      "Venha celebrar o nosso amor! Mal podemos esperar para viver este momento convosco.";
    const local = "Sítio das Flores, São Paulo - SP";

    const dataInicio = "20270424T190000Z";
    const dataFim = "20270425T030000Z";

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      window.location.href = "/convite.ics";
    } else {
      const urlGoogle = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&details=${encodeURIComponent(detalhes)}&location=${encodeURIComponent(local)}&dates=${dataInicio}/${dataFim}`;
      window.open(urlGoogle, "_blank");
    }
  });
}
