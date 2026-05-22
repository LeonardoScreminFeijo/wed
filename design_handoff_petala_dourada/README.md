# Handoff: Redesign Visual — Pétala Dourada

## Visão Geral

Redesign visual completo do site de casamento **Ana & Leo** (`LeonardoScreminFeijo/wed`).
O redesign preserva toda a estrutura, JavaScript e funcionalidades existentes — apenas a **camada visual** muda.

**Conceito:** *Pétala Dourada* — o dourado (`#fdc566`) é o tom dominante e a alma do site.
O vinho (`#880a1f`) é usado com parcimônia como âncora tipográfica elegante.
Fundo muito claro (`#fffdf8`), tipografia refinada (Cormorant Garamond + Jost).

---

## Fidelidade

**Alta fidelidade (hifi).** Os arquivos de referência neste pacote são protótipos em HTML
mostrando o visual e comportamento exatos. O desenvolvedor deve recriar esses visuais
**modificando os arquivos CSS e HTML existentes no repositório** — não substituir o HTML por completo.
Toda lógica JS (autenticação, countdown, mural, RSVP, etc.) deve ser preservada intacta.

---

## Referência Visual

Abrir `Proposta Visual.html` para ver as duas variações lado a lado. A **Variação 1 — Pétala Dourada** é a escolhida.

---

## Branch de Trabalho

Seguindo o fluxo do `CLAUDE.md`:

```bash
git checkout dev
git checkout -b feat/redesign-petala-dourada
# ... fazer todas as alterações aqui ...
git checkout dev
git merge feat/redesign-petala-dourada
git push origin dev
```

> ⚠️ **Nunca commitar direto no `master`.**
> Todo o trabalho deve ir para `feat/redesign-petala-dourada`, depois merge no `dev`.

---

## Arquivos Fornecidos neste Pacote

| Arquivo | O que é | Ação |
|---|---|---|
| `src/css/variables.css` | Novo arquivo de variáveis CSS | **Substituir** o original |
| `src/css/overrides-petala.css` | Patches visuais adicionais | **Adicionar** ao projeto |
| `Proposta Visual.html` | Referência visual (não publicar) | Consulta apenas |

---

## Passo a Passo de Implementação

### PASSO 1 — Atualizar `variables.css`

Substituir o conteúdo de `src/css/variables.css` pelo arquivo fornecido neste pacote.

**Mudanças-chave:**
- `--bg-light: #fffcf9` → `#fffdf8` (mais claro e quente)
- `--text-dark: #3a2e2c` → `#2e1f1c` (mais quente)
- `--font-titles: 'Playfair Display'` → `'Cormorant Garamond'`
- `--font-text: 'Lato'` → `'Jost'`
- Novas variáveis: `--text-muted`, `--bg-card`, `--border-soft`, `--gold-pale`

---

### PASSO 2 — Adicionar `overrides-petala.css` ao projeto

Copiar `src/css/overrides-petala.css` para a pasta `src/css/` do repositório.

Depois, em **todos os HTMLs** (`index.html`, `nossa-historia.html`, `dicas.html`, `rsvp.html`, `gifts.html`, `mural.html`), adicionar o link **após** o link do `style.css`:

```html
<!-- ANTES -->
<link rel="stylesheet" href="./src/css/style.css" />

<!-- DEPOIS (adicionar a linha abaixo) -->
<link rel="stylesheet" href="./src/css/style.css" />
<link rel="stylesheet" href="./src/css/overrides-petala.css" />
```

---

### PASSO 3 — Atualizar Google Fonts em todos os HTMLs

Substituir o link de fontes em **todos os HTMLs**:

```html
<!-- REMOVER -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,600&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

<!-- ADICIONAR NO LUGAR -->
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400;1,600&family=Jost:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
```

---

### PASSO 4 — Atualizar HTML do Hero (`index.html`)

Reestruturar a `hero-content` para alinhar texto à esquerda/baixo, sem o card de vidro.

**ANTES:**
```html
<section class="hero-section">
  <div class="hero-content">
    <p class="pre-title">Save the Date</p>
    <h1>Ana Carolina e Leonardo</h1>
    <p>Chácara Doce Recanto • Curitiba, PR</p>
    <div id="countdown" class="countdown-container"></div>
  </div>
</section>
```

**DEPOIS:**
```html
<section class="hero-section">
  <div class="hero-content">
    <p class="pre-title">Save the Date · Curitiba, PR</p>
    <h1>Ana Carolina<br>e Leonardo</h1>
    <div class="hero-rule"></div>
    <p class="hero-location">
      Chácara Doce Recanto · Sábado, 24 de Abril de 2027 · 16h
    </p>
    <div id="countdown" class="countdown-container"></div>
  </div>
</section>
```

> Os estilos de `.hero-rule` e `.hero-location` já estão no `overrides-petala.css`.

---

### PASSO 5 — Atualizar HTML da Sidebar (todos os HTMLs)

Adicionar dois elementos logo abaixo do `<h2 class="sidebar-title">`, antes de `<ul class="nav-links">`:

**ANTES:**
```html
<a href="index.html" class="logo-link">
  <h2 class="sidebar-title">A & L</h2>
</a>

<ul class="nav-links">
```

**DEPOIS:**
```html
<a href="index.html" class="logo-link">
  <h2 class="sidebar-title">A & L</h2>
</a>
<p class="sidebar-date">24 de Abril de 2027</p>
<div class="sidebar-divider"></div>

<ul class="nav-links">
```

---

### PASSO 6 — Adicionar `.section-subtitle` nas páginas internas

Em cada página que tem um `.section-title`, adicionar logo abaixo um parágrafo com a classe `section-subtitle`. Exemplos:

**`index.html` — seção O Grande Dia:**
```html
<h2 class="section-title">O Grande Dia</h2>
<p class="section-subtitle">Informações do evento</p>
```

**`nossa-historia.html`:**
```html
<h1 class="section-title">Nossa História</h1>
<p class="section-subtitle">A nossa jornada juntos</p>
```

**`dicas.html`:**
```html
<h1 class="section-title">Dicas e Hospedagem</h1>
<p class="section-subtitle">Tudo que você precisa saber</p>
```

**`rsvp.html`:**
```html
<h1 class="section-title">Confirmar Presença</h1>
<p class="section-subtitle">Confirme até 01 de Março de 2027</p>
```

**`gifts.html`:**
```html
<h1 class="section-title">Lista de Presentes</h1>
<p class="section-subtitle">Contribua como puder, com amor</p>
```

**`mural.html`:**
```html
<h1 class="section-title">Mural de Recados</h1>
<p class="section-subtitle">Deixe uma mensagem para os noivos</p>
```

---

### PASSO 7 — Verificação visual

Após aplicar todas as alterações, conferir:

- [ ] Hero sem card de vidro, texto alinhado à esquerda/baixo
- [ ] Countdown sem caixas brancas, números grandes com divisórias finas
- [ ] Sidebar com data e divisória dourada
- [ ] Cards com borda superior dourada→laranja (sem sombra e sem border-radius)
- [ ] Botões `btn-small` como links-texto uppercase com `↗`
- [ ] Botão de música minúsculo e discreto (32px ghost)
- [ ] Fontes Cormorant Garamond nos títulos (itálico, 300)
- [ ] Fontes Jost no corpo do texto
- [ ] Dark mode funcionando (checar com toggle)
- [ ] Mobile responsivo (320px, 375px, 768px)

---

## Tokens de Design

### Cores

| Token CSS | Hex | Uso |
|---|---|---|
| `--color-wine` | `#880a1f` | Títulos, monograma, âncora |
| `--color-coral` | `#fd5d3d` | CTAs, links ativos |
| `--color-orange` | `#fd921e` | Labels de seção, `.hora` |
| `--color-yellow` | `#fdc566` | Dividers, bordas, tom dominante |
| `--bg-light` | `#fffdf8` | Fundo geral |
| `--text-dark` | `#2e1f1c` | Texto principal |
| `--text-muted` | `#907470` | Texto secundário |
| `--bg-card` | `#ffffff` | Fundo de cards e sidebar |
| `--border-soft` | `#f0e8d8` | Bordas sutis |
| `--gold-pale` | `#fef4dc` | Fundo de seções de design tokens |

### Tipografia

| Papel | Fonte | Peso | Estilo |
|---|---|---|---|
| Títulos (h1, h2) | Cormorant Garamond | 300 | Itálico |
| Monograma sidebar | Cormorant Garamond | 300 | Itálico, 2.8rem |
| Corpo do texto | Jost | 300–400 | Normal |
| Labels/pre-title | Jost | 300 | Uppercase, letter-spacing 0.3–0.4em |
| CTA/links | Jost | 500 | Uppercase, letter-spacing 0.18em |

### Bordas e Shapes

| Componente | Antes | Depois |
|---|---|---|
| Cards (`.evento-card`) | `border-radius: 20px` | `border-radius: 0` + borda topo gradiente |
| Botão submit | `border-radius: 25px` | `border-radius: 0` |
| Modal login | `border-radius: 24px` | `border-radius: 0` |
| Mapa | `border-radius: 20px` | `border-radius: 0` |

---

## Arquivos NÃO Modificados

Os seguintes arquivos **não precisam de nenhuma alteração**:

- `src/main.js` e todos os módulos em `src/js/`
- `vercel.json`, `vite.config.js`, `package.json`
- `public/` (áudio, ics, favicon)
- `admin.html`
- `.env` / `.env.example`
- `src/assets/` (imagens e ícones)

---

## Observações Finais

- **Nunca harducodar cores** — usar sempre as variáveis CSS de `variables.css`
- As variáveis `--color-pink` e `--color-wine` do arquivo original podem ser removidas
  se não houver uso restante após a migração
- O arquivo `overrides-petala.css` usa seletores de baixa especificidade propositalmente;
  se alguma regra não estiver funcionando, verificar se há `!important` em `style.css`
  que precise ser removido
- Testar o dark mode ao final — os ajustes estão incluídos na seção 18 do `overrides-petala.css`
