export function configurarBotaoCalendario() {
  const btnCalendario = document.getElementById("btn-calendario");

  if (!btnCalendario) return;

  btnCalendario.addEventListener("click", (event) => {
    const titulo = "Casamento Ana & Léo";
    const detalhes =
      "Venha celebrar o nosso amor! Mal podemos esperar para viver este momento convosco.";
    const local = "Sítio das Flores, São Paulo - SP";

    const dataInicio = "20270424T190000Z";
    const dataFim = "20270425T025900Z";

    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isIOS) {
      const icsConteudo = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "BEGIN:VEVENT",
        `DTSTART:${dataInicio}`,
        `DTEND:${dataFim}`,
        `SUMMARY:${titulo}`,
        `DESCRIPTION:${detalhes}`,
        `LOCATION:${local}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\n");

      const blob = new Blob([icsConteudo], {
        type: "text/calendar;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "casamento-ana-leo.ics");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const urlGoogle = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&details=${encodeURIComponent(detalhes)}&location=${encodeURIComponent(local)}&dates=${dataInicio}/${dataFim}`;
      window.open(urlGoogle, "_blank");
    }
  });
}
