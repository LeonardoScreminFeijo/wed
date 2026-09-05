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
| `rsvp.html`        | `/rsvp`        | Público    |
| `gifts.html`       | `/gifts`       | Público    |
| `mural.html`       | `/mural`       | Público (exclusão de recado exige login noivos) |
| `fotos.html`       | `/fotos`       | Público    |
| `admin.html`       | `/admin`       | Restrito (só `ana`/`leo`) |

## Fluxo de Branches (Git)

```
master          ← produção estável, só recebe merge do dev
└── dev         ← integração, base de todo desenvolvimento
    ├── feat/nome-da-feature
    ├── fix/nome-do-bug
    └── chore/nome-da-tarefa
```

### Regras

- **Nunca commitar direto no `master`** — ele só recebe merge do `dev` quando estiver estável
- **Todo trabalho nasce do `dev`** — criar sub-branch a partir dele antes de começar qualquer mudança
- **Nomenclatura das sub-branches:**
  - `feat/` — nova funcionalidade (ex: `feat/painel-admin`)
  - `fix/` — correção de bug (ex: `fix/xss-mural`)
  - `chore/` — ajustes sem impacto funcional (ex: `chore/atualizar-gitignore`)
- Ao terminar, fazer merge da sub-branch de volta no `dev`
- Quando `dev` estiver pronto para ir a ar, merge no `master` + push

### Comandos do fluxo

```bash
# Iniciar uma nova tarefa
git checkout dev
git checkout -b feat/minha-feature

# Finalizar e integrar ao dev
git checkout dev
git merge feat/minha-feature
git push origin dev

# Subir para produção
git checkout master
git merge dev
git push origin master
```

## Autenticação

- Login não é mais exigido para convidados — `rsvp.html`, `gifts.html`, `mural.html` e `fotos.html` são públicos. Login existe só para os noivos acessarem o dashboard e apagar recados
- Login via `POST` para `VITE_API_URL_LOGIN` (backend externo)
- Sessão armazenada em `sessionStorage` como `wedding_auth_user` (string com o nome do usuário)
- Roles: `ana` ou `leo` = admin (noivos), `teste` = modo teste (usado internamente pelos noivos para demonstração, sem gate de página)
- Proteção da página restrita: `admin-guard.js` (script inline no `<head>` de `admin.html`, redireciona quem não for `ana`/`leo`)
- Botão de excluir recado no `mural.html` só aparece para `isNoivos()`; a API sempre revalida o usuário no DELETE
- Brute force: 3 tentativas → bloqueio de 5 minutos (armazenado em `localStorage`)
- Inatividade: logout automático após 5 minutos sem interação

## Variáveis de Ambiente

Definidas em `.env` (não versionado). Ver `.env.example`:

```
VITE_API_URL_LOGIN   → Endpoint de autenticação
VITE_API_URL_RSVP    → Google Sheets / endpoint de confirmação de presença
VITE_API_URL_MURAL   → CRUD de recados (GET/POST/DELETE)
VITE_API_URL_LOGS    → Endpoint de logging em nuvem
VITE_PIX_TESTE       → Chave PIX de teste (produção usa chaves por item)
VITE_MP_PUBLIC_KEY   → Public Key do Mercado Pago (Payment Bricks, cliente)
MP_ACCESS_TOKEN      → Access Token do Mercado Pago (secret, só backend — NUNCA prefixo VITE_)
```

> Variáveis com prefixo `VITE_` são expostas no bundle cliente — não colocar secrets aqui.

## Módulos JS (`src/js/`)

| Arquivo         | Responsabilidade                                      |
|-----------------|-------------------------------------------------------|
| `login.js`      | Modal de login (só noivos), sessão, roles, timer de inatividade |
| `admin-guard.js`| Redirect antecipado (sem módulo) para `admin.html` se não for `ana`/`leo` |
| `rsvp.js`       | Formulário dinâmico de confirmação de presença        |
| `mural.js`      | Mural de recados (carrega, posta, deleta da nuvem)    |
| `presentes.js`  | Cópia de chaves PIX por item                         |
| `mercadopago.js`| Modal com Payment Brick (Pix/Cartão) na Lista de Presentes |
| `logger.js`     | Logger client-side com envio para API de logs         |
| `countdown.js`  | Contagem regressiva até o casamento                   |
| `confetti.js`   | Confetes (canvas-confetti)                            |
| `toast.js`      | Toasts de feedback (toastify-js)                      |
| `calendar.js`   | Botão "Adicionar ao Calendário" (.ics)                |
| `timeline.js`   | Timeline vertical (Nossa História) — clique na foto abre a caixa de diálogo ao lado |
| `accordion.js`  | Sanfona de FAQ/Dicas                                  |
| `music.js`      | Player de música de fundo flutuante                   |

## Backend Serverless (`api/`)

- **Vercel Functions**, não AWS — mesma origin do site, sem CORS.
- `mp-criar-pagamento.js`: recebe submit do Payment Brick, valida item/valor contra whitelist server-side (`api/_lib/itens-presentes.js`, nunca confia no valor do client), cria o pagamento via SDK `mercadopago` com `MP_ACCESS_TOKEN`. Exceção: item com `livre: true` (ex: `pix_livre`) aceita valor do client, mas valida `>= minimo` no servidor antes de criar o pagamento.
- `mp-webhook.js`: recebe notificação do Mercado Pago, sempre reconsulta o pagamento pela API antes de considerar confirmado (nunca confia no payload da notificação).
- `_lib/itens-presentes.js`: fonte da verdade dos valores dos presentes — manter em sincronia manual com os cards de `gifts.html`.
- `_lib/server-logger.js`: equivalente server-side de `logger.js` (aquele é browser-only).

## Modo Teste

Usuário `teste` desvia todas as chamadas reais às APIs (RSVP, mural, PIX, Mercado Pago). Útil para demonstração sem poluir dados. Verificar sempre com `isTestUser()` antes de chamadas reais.

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
