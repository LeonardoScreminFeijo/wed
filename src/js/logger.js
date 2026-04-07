const LOG_URL = import.meta.env.VITE_API_URL_LOGS;

function enviarParaNuvem(nivel, acao, detalhes) {
   if (!LOG_URL) return;

   const usuarioLogado = sessionStorage.getItem("wedding_auth_user") || "Não logado";

   let detalhesComUsuario = typeof detalhes === 'object' ? { ...detalhes } : { msg: detalhes };

   if (!detalhesComUsuario.usuario) {
      detalhesComUsuario.usuario = usuarioLogado;
   }

   const params = new URLSearchParams();
   params.append("nivel", nivel);
   params.append("acao", acao);
   params.append("detalhes", JSON.stringify(detalhesComUsuario));

   fetch(LOG_URL, {
      method: "POST",
      body: params,
      mode: "no-cors",
   }).catch((err) => console.error("Falha ao enviar log para a nuvem:", err));
}

export const Logger = {
   info: (acao, detalhes = {}) => {
      const data = new Date().toISOString();
      console.info(`📘 [INFO] ${data} - ${acao}`, detalhes);
      enviarParaNuvem("INFO", acao, detalhes);
   },

   warn: (acao, detalhes = {}) => {
      const data = new Date().toISOString();
      console.warn(`📙 [WARN] ${data} - ${acao}`, detalhes);
      enviarParaNuvem("WARN", acao, detalhes);
   },

   error: (acao, erro, detalhes = {}) => {
      const data = new Date().toISOString();
      const erroMsg = erro.message || erro;
      console.error(`📕 [ERROR] ${data} - ${acao}`, erroMsg, detalhes);

      const detalhesComErro = { erro: erroMsg, ...detalhes };
      enviarParaNuvem("ERROR", acao, detalhesComErro);
   }
};