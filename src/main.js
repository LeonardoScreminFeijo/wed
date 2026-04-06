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

document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.getElementById("btn-menu-global");
  const layoutWrapper = document.getElementById("app-layout");

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
