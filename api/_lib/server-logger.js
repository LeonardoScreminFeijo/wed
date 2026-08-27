// Equivalente server-side de src/js/logger.js (aquele usa import.meta.env/browser, não roda em serverless).
const LOG_URL = process.env.VITE_API_URL_LOGS;

function enviar(nivel, acao, detalhes) {
  console.log(`[${nivel}] ${acao}`, detalhes);
  if (!LOG_URL) return;
  const params = new URLSearchParams();
  params.append("nivel", nivel);
  params.append("acao", acao);
  params.append("detalhes", JSON.stringify(detalhes));
  fetch(LOG_URL, { method: "POST", body: params }).catch((err) =>
    console.error("Falha ao enviar log para a nuvem:", err),
  );
}

export const ServerLogger = {
  info: (acao, detalhes = {}) => enviar("INFO", acao, detalhes),
  warn: (acao, detalhes = {}) => enviar("WARN", acao, detalhes),
  error: (acao, erro, detalhes = {}) =>
    enviar("ERROR", acao, { erro: erro.message || String(erro), ...detalhes }),
};
