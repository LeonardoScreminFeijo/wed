// ─── CONFIGURAÇÃO ─────────────────────────────────────────────────────────────
// Para adicionar fotos:
// 1. Abra a foto no Google Photos → compartilhar → copiar link
// 2. Abra o link em aba anônima → clique-direito na foto → "Copiar endereço da imagem"
// 3. Cole abaixo, removendo qualquer parâmetro de tamanho no final (ex: =w1920-h1080)
// Exemplo: "https://lh3.googleusercontent.com/pw/ABC123"
const FOTOS = [
  // { url: "https://lh3.googleusercontent.com/pw/...", legenda: "Nossa história" },
];
// ─────────────────────────────────────────────────────────────────────────────

let currentIndex = 0;

export function iniciarGaleria() {
  const grid = document.getElementById("galeria-grid");
  if (!grid) return;

  if (FOTOS.length === 0) {
    grid.innerHTML = '<p class="galeria-vazia">Em breve as fotos do nosso grande dia! 📸</p>';
    return;
  }

  FOTOS.forEach((foto, index) => {
    const item = document.createElement("div");
    item.className = "galeria-item";

    const img = document.createElement("img");
    img.src = foto.url + "=w600-h400-c";
    img.alt = foto.legenda || `Foto ${index + 1}`;
    img.loading = "lazy";
    img.className = "galeria-thumb";
    img.addEventListener("click", () => abrirLightbox(index));

    item.appendChild(img);
    grid.appendChild(item);
  });

  configurarLightbox();
}

function abrirLightbox(index) {
  currentIndex = index;
  const lb  = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");
  const leg = document.getElementById("lightbox-legenda");
  const cnt = document.getElementById("lightbox-contador");

  img.src = "";
  img.src = FOTOS[index].url + "=w1920";
  leg.textContent = FOTOS[index].legenda || "";
  cnt.textContent = `${index + 1} / ${FOTOS.length}`;
  lb.classList.add("ativo");
  document.body.style.overflow = "hidden";
}

function fecharLightbox() {
  const lb  = document.getElementById("lightbox");
  lb.classList.remove("ativo");
  document.body.style.overflow = "";
  document.getElementById("lightbox-img").src = "";
}

function navLightbox(dir) {
  currentIndex = (currentIndex + dir + FOTOS.length) % FOTOS.length;
  const img = document.getElementById("lightbox-img");
  const leg = document.getElementById("lightbox-legenda");
  const cnt = document.getElementById("lightbox-contador");
  img.src = "";
  img.src = FOTOS[currentIndex].url + "=w1920";
  leg.textContent = FOTOS[currentIndex].legenda || "";
  cnt.textContent = `${currentIndex + 1} / ${FOTOS.length}`;
}

function configurarLightbox() {
  document.getElementById("lightbox-fechar")
    .addEventListener("click", fecharLightbox);
  document.getElementById("lightbox-prev")
    .addEventListener("click", () => navLightbox(-1));
  document.getElementById("lightbox-next")
    .addEventListener("click", () => navLightbox(1));

  document.getElementById("lightbox").addEventListener("click", (e) => {
    if (e.target.id === "lightbox") fecharLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!document.getElementById("lightbox").classList.contains("ativo")) return;
    if (e.key === "Escape")      fecharLightbox();
    if (e.key === "ArrowLeft")   navLightbox(-1);
    if (e.key === "ArrowRight")  navLightbox(1);
  });

  // Swipe mobile
  let touchStartX = 0;
  const lb = document.getElementById("lightbox");
  lb.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navLightbox(diff > 0 ? 1 : -1);
  });
}
