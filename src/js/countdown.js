export function iniciarContagem(dataEvento) {
  const countdownElement = document.getElementById("countdown");
  if (!countdownElement) return;

  countdownElement.innerHTML = `
        <div class="time-box"><span id="days">00</span><p>Dias</p></div>
        <div class="time-box"><span id="hours">00</span><p>Horas</p></div>
        <div class="time-box"><span id="minutes">00</span><p>Minutos</p></div>
        <div class="time-box"><span id="seconds">00</span><p>Segundos</p></div>
    `;

  const atualizar = () => {
    const agora = new Date().getTime();
    const distancia = dataEvento.getTime() - agora;

    if (distancia < 0) {
      countdownElement.innerHTML = "<h3>É hoje o grande dia!</h3>";
      return;
    }

    document.getElementById("days").innerText = Math.floor(
      distancia / (1000 * 60 * 60 * 24),
    )
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").innerText = Math.floor(
      (distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    )
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").innerText = Math.floor(
      (distancia % (1000 * 60 * 60)) / (1000 * 60),
    )
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").innerText = Math.floor(
      (distancia % (1000 * 60)) / 1000,
    )
      .toString()
      .padStart(2, "0");
  };

  setInterval(atualizar, 1000);
  atualizar();
}
