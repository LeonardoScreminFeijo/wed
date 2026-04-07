export function configurarBotaoCalendario() {
  const btnCalendario = document.getElementById("btn-calendar");

  if (!btnCalendario) return;

  const titulo = "Casamento Ana & Léo";
  const detalhes =
    "Venha celebrar o nosso amor! Mal podemos esperar para viver este momento convosco.";
  const local = "Chácara Doce Recanto | Curitiba, PR";

  const dataInicio = "20270424T190000Z";
  const dataFim = "20270425T030000Z";

  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isIOS) {
    btnCalendario.href = "/convite.ics";
  } else {
    const urlGoogle = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&details=${encodeURIComponent(detalhes)}&location=${encodeURIComponent(local)}&dates=${dataInicio}/${dataFim}`;
    btnCalendario.href = urlGoogle;
    btnCalendario.target = "_blank"; // Abre numa nova aba limpa
  }
}
