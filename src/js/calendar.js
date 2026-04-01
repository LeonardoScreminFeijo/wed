export function configurarBotaoCalendario() {
    const btn = document.getElementById('btn-calendar');
    if (!btn) return;

    const titulo = encodeURIComponent("Casamento Ana Carolina e Leonardo 💍");
    const dataInicio = "20270424T190000Z"; 
    const dataFim = "20270425T050000Z"; 
    const detalhes = encodeURIComponent("Estamos muito felizes em celebrar nosso amor com você!");
    const local = encodeURIComponent("Chácara Doce Recanto, R. Pedro Pilato, 630/B - Umbará, Curitiba - PR");

    const urlGoogleCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${dataInicio}/${dataFim}&details=${detalhes}&location=${local}`;

    btn.addEventListener('click', (evento) => {
        evento.preventDefault();
        window.open(urlGoogleCalendar, '_blank');
    });
}