import "./css/style.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { iniciarContagem } from "./js/countdown.js";
import { configurarBotaoCalendario } from "./js/calendar.js";
import { iniciarTimeline } from "./js/timeline.js";
import { iniciarSanfona } from "./js/accordion.js";
import { iniciarRSVP } from "./js/rsvp.js";
import { iniciarLogin } from "./js/login.js";
import { iniciarMural } from "./js/mural.js";
import { iniciarMusica } from "./js/music.js";

const countdownElement = document.getElementById("countdown");
if (countdownElement) {
  const dataCasamento = new Date(2027, 3, 24, 16, 0, 0);
  iniciarContagem(dataCasamento);
}

configurarBotaoCalendario();
iniciarTimeline();
iniciarSanfona();
iniciarRSVP();
iniciarLogin();

window.addEventListener("load", () => {
  setTimeout(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
    });
    AOS.refresh();
  }, 100);
});

const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

if (themeToggle) {
  // 1. Lê a memória do navegador
  const currentTheme = localStorage.getItem("theme");

  // 2. Se o utilizador já usava o modo escuro, liga a chave e aplica o tema
  if (currentTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.checked = true; // Empurra a bolinha para a direita
  } else {
    themeToggle.checked = false; // Mantém a bolinha na esquerda
  }

  // 3. Ouve o deslizar da chave
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      body.classList.add("dark-mode"); // Ativa cores escuras
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-mode"); // Volta para o claro
      localStorage.setItem("theme", "light");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.getElementById("btn-menu-global");
  const layoutWrapper = document.getElementById("app-layout");
  iniciarMusica();

  if (btnMenu && layoutWrapper) {
    btnMenu.addEventListener("click", () => {
      layoutWrapper.classList.toggle("menu-aberto");
    });

    const linksMenu = document.querySelectorAll(".nav-links a");
    linksMenu.forEach((link) => {
      link.addEventListener("click", () => {
        layoutWrapper.classList.remove("menu-aberto");
      });
    });

    const conteudoPrincipal = document.querySelector(".main-content");
    if (conteudoPrincipal) {
      conteudoPrincipal.addEventListener("click", () => {
        if (layoutWrapper.classList.contains("menu-aberto")) {
          layoutWrapper.classList.remove("menu-aberto");
        }
      });
    }
  }
});

iniciarMural();
