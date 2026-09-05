const CHAVE_ESTADO = "wedding_music"; // "on" | "off"
const CHAVE_POS = "wedding_music_pos"; // segundos tocados

export function iniciarMusica() {
  const btnMusica = document.getElementById("btn-musica");
  const audio = document.getElementById("audio-casamento");
  const icone = btnMusica ? btnMusica.querySelector(".icone-musica") : null;

  if (!btnMusica || !audio) return;

  const lerEstado = () => {
    try {
      return sessionStorage.getItem(CHAVE_ESTADO);
    } catch {
      return null;
    }
  };
  const salvar = (chave, valor) => {
    try {
      sessionStorage.setItem(chave, valor);
    } catch {
      /* modo privado / storage bloqueado — segue sem persistir */
    }
  };

  // Retoma de onde parou ao navegar entre as páginas
  try {
    const pos = parseFloat(sessionStorage.getItem(CHAVE_POS));
    if (!Number.isNaN(pos) && pos > 0) audio.currentTime = pos;
  } catch {
    /* ignora */
  }

  function refletirTocando() {
    if (icone) icone.innerText = "🎵";
    btnMusica.classList.add("musica-tocando");
  }
  function refletirParado() {
    if (icone) icone.innerText = "🔇";
    btnMusica.classList.remove("musica-tocando");
  }

  // Listeners de "primeiro gesto" — usados quando o navegador bloqueia o
  // autoplay: a música começa no primeiro clique/toque/scroll/tecla em
  // qualquer lugar da página, sem precisar apertar o botão.
  const eventosGesto = ["pointerdown", "touchstart", "keydown", "click"];
  function pararDeEsperarGesto() {
    eventosGesto.forEach((ev) =>
      document.removeEventListener(ev, aoPrimeiroGesto, true),
    );
  }
  function aoPrimeiroGesto() {
    pararDeEsperarGesto();
    if (lerEstado() !== "off") tentarTocar();
  }
  function esperarGesto() {
    eventosGesto.forEach((ev) =>
      document.addEventListener(ev, aoPrimeiroGesto, {
        capture: true,
        once: false,
        passive: true,
      }),
    );
  }

  function tentarTocar() {
    const p = audio.play();
    if (p && typeof p.then === "function") {
      p.then(refletirTocando).catch(() => {
        // Autoplay barrado: espera o primeiro gesto do visitante
        refletirParado();
        esperarGesto();
      });
    } else {
      refletirTocando();
    }
  }

  btnMusica.addEventListener("click", () => {
    if (audio.paused) {
      salvar(CHAVE_ESTADO, "on");
      tentarTocar();
    } else {
      audio.pause();
      salvar(CHAVE_ESTADO, "off");
      pararDeEsperarGesto();
      refletirParado();
    }
  });

  audio.addEventListener("play", refletirTocando);
  audio.addEventListener("pause", refletirParado);

  // Guarda a posição para retomar na próxima página (no máx. 1x a cada 2s)
  const guardarPos = () => salvar(CHAVE_POS, String(audio.currentTime || 0));
  let ultimoSalvo = 0;
  audio.addEventListener("timeupdate", () => {
    const agora = Date.now();
    if (agora - ultimoSalvo > 2000) {
      ultimoSalvo = agora;
      guardarPos();
    }
  });
  window.addEventListener("pagehide", guardarPos);

  // Ao abrir o site já tenta tocar; só não insiste se o visitante
  // tiver desligado a música antes (nesta mesma sessão).
  if (lerEstado() === "off") {
    refletirParado();
  } else {
    tentarTocar();
  }
}
