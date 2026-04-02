import "./css/style.css";
import { iniciarContagem } from "./js/countdown.js";
import { configurarBotaoCalendario } from "./js/calendar.js";
import { iniciarTimeline } from "./js/timeline.js";
import { iniciarSanfona } from "./js/accordion.js";
import { iniciarRSVP } from "./js/rsvp.js";
import { iniciarLogin } from "./js/login.js";

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
