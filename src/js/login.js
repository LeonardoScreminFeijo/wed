const API_URL = import.meta.env.VITE_API_URL_LOGIN;

const CHAVE = "wedding_auth_user";

export function estaLogado() {
  return !!sessionStorage.getItem(CHAVE);
}

export function obterUsuario() {
  return sessionStorage.getItem(CHAVE);
}

export function isNoivos() {
  const usuario = obterUsuario();
  return usuario === "ana" || usuario === "leo";
}

export function isTestUser() {
  return obterUsuario() === "teste";
}

export function atualizarSidebar() {
  const nomeUsuario = document.getElementById("nome-usuario-logado");

  if (estaLogado()) {
    document.documentElement.classList.add("user-logged-in");

    if (isNoivos()) {
      document.documentElement.classList.add("user-is-admin");
    } else {
      document.documentElement.classList.remove("user-is-admin");
    }

    if (nomeUsuario) {
      nomeUsuario.textContent = "Olá, " + obterUsuario() + "!";
    }
  } else {
    document.documentElement.classList.remove("user-logged-in");
    document.documentElement.classList.remove("user-is-admin");

    if (nomeUsuario) {
      nomeUsuario.textContent = "";
    }
  }
}

export function abrirModal() {
  const modal = document.getElementById("modal-login");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  setTimeout(() => document.getElementById("login-input")?.focus(), 300);
}

export function fecharModal() {
  const modal = document.getElementById("modal-login");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
  document.getElementById("login-erro").textContent = "";
}

export function criarModal() {
  if (document.getElementById("modal-login")) return;

  const modal = document.createElement("div");
  modal.id = "modal-login";
  modal.className = "login-modal-overlay";
  modal.innerHTML = `
    <div class="login-modal-card" role="dialog" aria-modal="true">
      <button class="login-modal-fechar" id="btn-fechar-modal" aria-label="Fechar">✕</button>
      <div class="login-modal-header">
        <p class="login-modal-initials">A & L</p>
        <h2>Área Restrita</h2>
        <p class="login-modal-subtitulo">Acesso exclusivo para convidados</p>
      </div>
      <form id="form-login" novalidate>
        <div class="login-input-group">
          <label for="login-input">Login</label>
          <input type="text" id="login-input" placeholder="Seu login" autocomplete="username" required />
        </div>
        <div class="login-input-group">
          <label for="senha-input">Senha</label>
          <div class="login-senha-wrapper">
            <input type="password" id="senha-input" placeholder="Sua senha" autocomplete="current-password" required />
            <button type="button" class="btn-toggle-senha" id="btn-toggle-senha" aria-label="Mostrar senha">👁</button>
          </div>
        </div>
        <p class="login-erro" id="login-erro" aria-live="polite"></p>
        <button type="submit" class="btn-login-submit" id="btn-login-submit">Entrar</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) fecharModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) fecharModal();
  });

  document
    .getElementById("btn-fechar-modal")
    .addEventListener("click", fecharModal);

  const btnToggle = document.getElementById("btn-toggle-senha");
  const senhaInput = document.getElementById("senha-input");

  btnToggle.addEventListener("click", () => {
    const visivel = senhaInput.type === "text";
    senhaInput.type = visivel ? "password" : "text";
    btnToggle.textContent = visivel ? "👁" : "🙈";
  });

  document
    .getElementById("form-login")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const erro = document.getElementById("login-erro");
      const btn = document.getElementById("btn-login-submit");

      // ==========================================
      // 1. VERIFICAÇÃO DE BLOQUEIO (FORÇA BRUTA)
      // ==========================================
      const bloqueioAte = localStorage.getItem("wedding_login_lock");

      if (bloqueioAte && Date.now() < parseInt(bloqueioAte)) {
        const tempoRestante = Math.ceil(
          (parseInt(bloqueioAte) - Date.now()) / 60000,
        );
        erro.textContent = `Muitas tentativas falhas. Tente novamente em ${tempoRestante} minuto(s).`;

        const card = document.querySelector(".login-modal-card");
        card.classList.add("shake");
        setTimeout(() => card.classList.remove("shake"), 600);
      } else if (bloqueioAte) {
        localStorage.removeItem("wedding_login_lock");
        localStorage.removeItem("wedding_login_attempts");
      }
      // ==========================================

      const loginVal = document
        .getElementById("login-input")
        .value.trim()
        .toLowerCase();
      const senhaVal = document.getElementById("senha-input").value;

      btn.textContent = "Verificando...";
      btn.disabled = true;
      erro.textContent = "";

      try {
        const resposta = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ login: loginVal, senha: senhaVal }),
        });

        const dados = await resposta.json();

        if (dados.sucesso) {
          localStorage.removeItem("wedding_login_attempts");
          localStorage.removeItem("wedding_login_lock");

          sessionStorage.setItem(CHAVE, loginVal);
          atualizarSidebar();
          fecharModal();
          document.getElementById("form-login").reset();
        } else {
          let tentativas = parseInt(
            localStorage.getItem("wedding_login_attempts") || "0",
          );
          tentativas++;
          localStorage.setItem("wedding_login_attempts", tentativas);

          if (tentativas >= 3) {
            const tempoBloqueio = Date.now() + 1 * 60 * 1000;
            localStorage.setItem("wedding_login_lock", tempoBloqueio);
            erro.textContent =
              "Muitas tentativas falhas. Tente novamente em 5 minutos.";
          } else {
            erro.textContent =
              dados.mensagem ||
              `Login incorreto. Você tem mais ${3 - tentativas} tentativa(s).`;
          }

          const card = document.querySelector(".login-modal-card");
          card.classList.add("shake");
          setTimeout(() => card.classList.remove("shake"), 600);
        }
      } catch (err) {
        console.error("Erro ao conectar na API:", err);
        erro.textContent = "Erro de conexão. Tente novamente.";
      } finally {
        if (
          !localStorage.getItem("wedding_login_lock") ||
          Date.now() > parseInt(localStorage.getItem("wedding_login_lock"))
        ) {
          btn.textContent = "Entrar";
          btn.disabled = false;
        } else {
          btn.textContent = "Bloqueado";
        }
      }
    });
}

export function iniciarLogin() {
  criarModal();
  atualizarSidebar();

  if (estaLogado()) {
    configurarTimerInatividade();
  }

  const linkLogin = document.getElementById("link-login");
  const linkLogout = document.getElementById("link-logout");

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("login") === "necessario") {
    abrirModal();
    window.history.replaceState({}, document.title, window.location.pathname);
    setTimeout(() => {
      document.getElementById("login-erro").textContent =
        "Por favor, faça login para acessar esta página.";
    }, 400);
  }

  if (linkLogin) {
    linkLogin.addEventListener("click", (e) => {
      e.preventDefault();
      abrirModal();
    });
  }

  if (linkLogout) {
    linkLogout.addEventListener("click", (e) => {
      e.preventDefault();
      efetuarLogout();
    });
  }
}

let inatividadeTimer;

function configurarTimerInatividade() {
  const TEMPO_LIMITE = 5 * 60 * 1000;

  function resetarTimer() {
    clearTimeout(inatividadeTimer);
    inatividadeTimer = setTimeout(() => {
      alert("Sua sessão expirou por inatividade.");
      efetuarLogout();
    }, TEMPO_LIMITE);
  }

  const eventos = [
    "mousedown",
    "mousemove",
    "keypress",
    "scroll",
    "touchstart",
    "click",
  ];

  eventos.forEach((evento) => {
    window.addEventListener(evento, resetarTimer, true);
  });

  resetarTimer();
}

function efetuarLogout() {
  clearTimeout(inatividadeTimer);
  sessionStorage.removeItem(CHAVE);
  atualizarSidebar();

  if (
    !window.location.pathname.endsWith("index.html") &&
    window.location.pathname !== "/"
  ) {
    window.location.href = "index.html";
  } else {
    window.location.reload();
  }
}

export function protegerPagina() {
  if (!sessionStorage.getItem(CHAVE)) {
    window.location.href = "index.html?login=necessario";
    return false;
  }
  return true;
}
