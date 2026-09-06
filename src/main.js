import "./css/style.css";
import AOS from "aos";
import { iniciarContagem } from "./js/countdown.js";
import { configurarBotaoCalendario } from "./js/calendar.js";
import { iniciarTimeline } from "./js/timeline.js";
import { iniciarSanfona } from "./js/accordion.js";
import { iniciarRSVP } from "./js/rsvp.js";
import { iniciarLogin } from "./js/login.js";
import { iniciarMural } from "./js/mural.js";
import { iniciarMusica } from "./js/music.js";
import { iniciarPagamentos } from "./js/mercadopago.js";
import { iniciarGaleria } from "./js/gallery.js";
import { iniciarNavegacaoSuave } from "./js/soft-nav.js";

const DATA_CASAMENTO = new Date(2027, 3, 24, 16, 0, 0);

// ── Inits que rodam a CADA página (primeira carga + navegação suave) ──
// Cada função só age se encontrar seus elementos dentro do #page-root novo.
function iniciarPagina() {
  iniciarContagem(DATA_CASAMENTO);
  configurarBotaoCalendario();
  iniciarTimeline();
  iniciarSanfona();
  iniciarRSVP();
  iniciarMural();
  iniciarPagamentos();
  iniciarGaleria();
  AOS.refreshHard();
}

// ── Inits do "shell" que persiste entre navegações (rodam UMA vez) ──
function iniciarShell() {
  configurarTema();
  configurarMenu();
  iniciarLogin();
  iniciarMusica();

  AOS.init({
    duration: 800,
    once: true,
    offset: 50,
  });

  iniciarNavegacaoSuave(iniciarPagina);
  window.addEventListener("load", () => AOS.refresh());
}

function configurarTema() {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    body.classList.add("dark-mode");
    themeToggle.checked = true;
  } else {
    themeToggle.checked = false;
  }

  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });
}

function configurarMenu() {
  const btnMenu = document.getElementById("btn-menu-global");
  const layoutWrapper = document.getElementById("app-layout");
  if (!btnMenu || !layoutWrapper) return;

  btnMenu.addEventListener("click", () => {
    layoutWrapper.classList.toggle("menu-aberto");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
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

iniciarShell();
iniciarPagina();
