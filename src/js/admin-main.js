import "../css/style.css";
import { iniciarLogin } from "./login.js";
import { iniciarMusica } from "./music.js";

iniciarLogin();

const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    themeToggle.checked = true;
  }
  themeToggle.addEventListener("change", () => {
    if (themeToggle.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarMusica();

  const btnMenu = document.getElementById("btn-menu-global");
  const layoutWrapper = document.getElementById("app-layout");
  if (btnMenu && layoutWrapper) {
    btnMenu.addEventListener("click", () => layoutWrapper.classList.toggle("menu-aberto"));
    document.querySelectorAll(".nav-links a").forEach(link =>
      link.addEventListener("click", () => layoutWrapper.classList.remove("menu-aberto"))
    );
    document.querySelector(".main-content")?.addEventListener("click", () => {
      if (layoutWrapper.classList.contains("menu-aberto")) {
        layoutWrapper.classList.remove("menu-aberto");
      }
    });
  }
});
