export function iniciarMusica() {
  const btnMusica = document.getElementById("btn-musica");
  const audio = document.getElementById("audio-casamento");
  const icone = btnMusica ? btnMusica.querySelector(".icone-musica") : null;

  if (!btnMusica || !audio) return;

  btnMusica.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      icone.innerText = "🎵";
      btnMusica.classList.add("musica-tocando");
    } else {
      audio.pause();
      icone.innerText = "🔇";
      btnMusica.classList.remove("musica-tocando");
    }
  });
}
