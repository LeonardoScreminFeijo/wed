import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

export function mostrarSucesso(mensagem) {
  Toastify({
    text: mensagem,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, var(--color-wine), #962335)",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      fontFamily: "Lato, sans-serif",
      fontSize: "1rem",
    },
  }).showToast();
}

export function mostrarErro(mensagem) {
  Toastify({
    text: mensagem,
    duration: 4000,
    close: true,
    gravity: "top",
    position: "right",
    style: {
      background: "linear-gradient(to right, var(--color-orange), #ff8a65)",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      fontFamily: "Lato, sans-serif",
      fontSize: "1rem",
    },
  }).showToast();
}
