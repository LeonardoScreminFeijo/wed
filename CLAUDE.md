# CLAUDE.md — Site de Casamento Ana & Leo

## Visão Geral

Site de casamento de Ana Carolina e Leonardo. Casamento em 24/04/2027, Chácara Doce Recanto, Umbará, Curitiba-PR. Projeto frontend estático com APIs externas, hospedado na Vercel.

## Stack

- **Bundler:** Vite 8.x (multi-page, sem framework)
- **JS:** Vanilla ES Modules
- **CSS:** Custom properties (variables.css), sem framework
- **Libs:** AOS (animações scroll), canvas-confetti, toastify-js
- **Deploy:** Vercel (`vercel.json` com `cleanUrls: true`)

## Estrutura de Páginas

| Arquivo            | Rota           | Acesso     |
|--------------------|----------------|------------|
| `index.html`       | `/`            | Público    |
| `nossa-historia.html` | `/nossa-historia` | Público |
| `dicas.html`       | `/dicas`       | Público    |
| `rsvp.html`        | `/rsvp`        | Restrito   |
| `gifts.html`       | `/gifts`       | Restrito   |
| `mural.html`       | `/mural`       | Restrito   |

## Autenticação

- Login via `POST` para `VITE_API_URL_LOGIN` (backend externo)
- Sessão armazenada em `sessionStorage` como `wedding_auth_user` (string com o nome do usuário)
- Roles: `ana` ou `leo` = admin (noivos), `teste` = modo teste, demais = convidado
- Proteção de páginas restritas: `auth-guard.js` (script inline no `<head>` para redirect imediato) + `protegerPagina()` no JS
- Brute force: 3 tentativas → bloqueio de 1 minuto (armazenado em `localStorage`)
- Inatividade: logout automático após 5 minutos sem interação

## Variáveis de Ambiente

Definidas em `.env` (não versionado). Ver `.env.example`:

```
VITE_API_URL_LOGIN   → Endpoint de autenticação
VITE_API_URL_RSVP    → Google Sheets / endpoint de confirmação de presença
VITE_API_URL_MURAL   → CRUD de recados (GET/POST/DELETE)
VITE_API_URL_LOGS    → Endpoint de logging em nuvem
VITE_PIX_TESTE       → Chave PIX de teste (produção usa chaves por item)
```

> Variáveis com prefixo `VITE_` são expostas no bundle cliente — não colocar secrets aqui.

## Módulos JS (`src/js/`)

| Arquivo         | Responsabilidade                                      |
|-----------------|-------------------------------------------------------|
| `login.js`      | Modal de login, sessão, roles, timer de inatividade   |
| `auth-guard.js` | Redirect antecipado (sem módulo) para páginas restritas |
| `rsvp.js`       | Formulário dinâmico de confirmação de presença        |
| `mural.js`      | Mural de recados (carrega, posta, deleta da nuvem)    |
| `presentes.js`  | Cópia de chaves PIX por item                         |
| `logger.js`     | Logger client-side com envio para API de logs         |
| `countdown.js`  | Contagem regressiva até o casamento                   |
| `confetti.js`   | Confetes (canvas-confetti)                            |
| `toast.js`      | Toasts de feedback (toastify-js)                      |
| `calendar.js`   | Botão "Adicionar ao Calendário" (.ics)                |
| `timeline.js`   | Timeline horizontal (Nossa História)                  |
| `accordion.js`  | Sanfona de FAQ/Dicas                                  |
| `music.js`      | Player de música de fundo flutuante                   |

## Modo Teste

Usuário `teste` desvia todas as chamadas reais às APIs (RSVP, mural, PIX). Útil para demonstração sem poluir dados. Verificar sempre com `isTestUser()` antes de chamadas reais.

## Comandos

```bash
npm run dev      # servidor local com HMR
npm run build    # build de produção em /dist
npm run preview  # preview do build
```

## Convenções

- HTML multi-page (não SPA) — cada página importa `/src/main.js` via `<script type="module">`
- Animações de entrada usam `data-aos` nos elementos HTML
- CSS usa variáveis em `variables.css`; nunca hardcodar cores
- Toda interação com API deve logar via `Logger.info/warn/error`
