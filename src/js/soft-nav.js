// Navegação "suave": troca só o conteúdo de #page-root via fetch, sem
// recarregar a página. Assim o <audio> de fundo (que fica FORA do
// #page-root) nunca é destruído e a música toca continuamente.
//
// Páginas com script próprio ou guarda no <head> (fotos, admin) ficam de
// fora e usam navegação normal do navegador.

const PAGINAS_SUAVES = new Set([
  "/",
  "/nossa-historia",
  "/dicas",
  "/rsvp",
  "/gifts",
  "/mural",
]);

function normalizar(pathname) {
  const p = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  return p === "" ? "/" : p;
}

let aoIniciarPagina = () => {};
let navegando = false;

export function iniciarNavegacaoSuave(callbackPagina) {
  if (typeof callbackPagina === "function") aoIniciarPagina = callbackPagina;

  history.scrollRestoration = "manual";

  document.addEventListener("click", (evento) => {
    if (
      evento.defaultPrevented ||
      evento.button !== 0 ||
      evento.metaKey ||
      evento.ctrlKey ||
      evento.shiftKey ||
      evento.altKey
    ) {
      return;
    }

    const link = evento.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href");
    if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return;
    }
    if (link.target && link.target !== "_self") return;
    if (link.hasAttribute("download")) return;
    if (link.origin !== location.origin) return;

    if (!PAGINAS_SUAVES.has(normalizar(link.pathname))) return; // navegação normal

    evento.preventDefault();

    if (normalizar(link.pathname) === normalizar(location.pathname)) {
      fecharMenu();
      return;
    }

    // URL "limpa" (sem .html) — combina com cleanUrls da Vercel e o dev do Vite
    const alvo = location.origin + normalizar(link.pathname) + link.search;
    navegarPara(alvo, true);
  });

  window.addEventListener("popstate", () => {
    if (PAGINAS_SUAVES.has(normalizar(location.pathname))) {
      navegarPara(location.href, false);
    } else {
      location.reload();
    }
  });
}

async function navegarPara(url, empurrarHistorico) {
  if (navegando) return;
  navegando = true;
  document.body.classList.add("navegando");

  try {
    const resposta = await fetch(url, {
      headers: { "X-Soft-Nav": "1" },
      credentials: "same-origin",
    });
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);

    const html = await resposta.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    const novoRoot = doc.getElementById("page-root");
    const rootAtual = document.getElementById("page-root");

    if (!novoRoot || !rootAtual) {
      window.location.href = url; // estrutura inesperada: cai pra navegação normal
      return;
    }

    rootAtual.replaceWith(novoRoot);
    document.title = doc.title;

    if (empurrarHistorico) history.pushState(null, "", url);

    sincronizarNavAtiva();
    fecharMenu();
    window.scrollTo(0, 0);

    aoIniciarPagina();
  } catch (erro) {
    window.location.href = url; // rede/erro: navegação normal como fallback
  } finally {
    navegando = false;
    document.body.classList.remove("navegando");
  }
}

function sincronizarNavAtiva() {
  const atual = normalizar(location.pathname);
  document.querySelectorAll(".sidebar .nav-links a").forEach((a) => {
    a.classList.toggle("active", normalizar(a.pathname) === atual);
  });
}

function fecharMenu() {
  document.getElementById("app-layout")?.classList.remove("menu-aberto");
}
