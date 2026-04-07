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
      const icsConteudo = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//CasamentoAnaLeo//NONSGML v1.0//EN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        `UID:${Date.now()}@anaeleo.com.br`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
        `DTSTART:${dataInicio}`,
        `DTEND:${dataFim}`,
        `SUMMARY:${titulo}`,
        `DESCRIPTION:${detalhes}`,
        `LOCATION:${local}`,
        "BEGIN:VALARM",
        "TRIGGER:-PT24H",
        "ACTION:DISPLAY",
        "DESCRIPTION:Lembrete de Casamento",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([icsConteudo], {
        type: "text/calendar;charset=utf-8",
      });
      const url = window.URL.createObjectURL(blob);

      window.location.href = url;

      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } else {
      const urlGoogle = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&details=${encodeURIComponent(detalhes)}&location=${encodeURIComponent(local)}&dates=${dataInicio}/${dataFim}`;
      window.open(urlGoogle, "_blank");
    }
  });
}
