# 💍 Site de Casamento | Ana & Leo

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-fd5d3d?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)
![AWS](https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Google](https://img.shields.io/badge/Google_Apps_Script-4285F4?style=for-the-badge&logo=google&logoColor=white)

Bem-vindo ao repositório do nosso site de casamento! Este projeto está sendo construído com muito carinho para celebrar o nosso grande dia, que acontecerá em **24 de Abril de 2027**, na Chácara Doce Recanto (Curitiba - PR).

O objetivo deste site é centralizar todas as informações para os nossos convidados, proporcionando uma experiência digital fluida, moderna e responsiva, com um design baseado na paleta "Tropical Chic" (Vinho, Coral, Laranja e Amarelo).

---

## 🚀 O Que Já Tem (Recursos Implementados)

A base do site (Front-end) já está construída utilizando uma arquitetura modular e boas práticas de **Clean Code**, focando na responsividade (Mobile-First).

- **🎨 UI/UX Responsiva:** Layout flexível com uma Sidebar Oculta (Menu Lateral) tanto no Desktop quanto Mobile.
- **⏱️ Contagem Regressiva em Tempo Real:** Um relógio dinâmico construído em JavaScript que calcula os dias, horas, minutos e segundos até o "Sim".
- **📅 Integração com Google Agenda:** Botão interativo que gera automaticamente um evento na agenda do convidado com data, horário, local e descrição do casamento.
- **🗺️ Mapa Integrado (Safe iframe):** Google Maps da chácara embarcado nativamente com travas de CSS (`max-width` e `flex-shrink`) para garantir que não quebre o layout em telas menores.
- **📖 Timeline Interativa "Z-Pattern" (Nossa História):** Uma linha do tempo desenvolvida do zero (sem bibliotecas externas) onde os convidados clicam em uma foto para ler aquele capítulo da história. Conta com animações suaves de zoom, transparência e desfoque dinâmico (Blur/Grayscale) nos itens inativos.
- **©️ Rodapé (Footer):** Fechamento do site com nossas iniciais e um design elegante.
- **🔎 Aba "Dicas e Hospedagem":** Uma seção de FAQ alertando sobre hotéis, salões de beleza e logística. (WIP)
- **🔐 Sistema de Autenticação Serverless (AWS):** Área VIP exclusiva para convidados protegida via integração com AWS API Gateway. O sistema conta com bloqueio de páginas nativo (Route Guards), gerenciamento de sessão (sessionStorage), timeout automático de inatividade (5 minuto) e técnicas avançadas de CSS direto no <head> para evitar o "piscar" da tela (FOUC) ao revelar os menus ocultos.
- **📋 Confirmação de Presença (RSVP):** Formulário integrado para os convidados confirmarem presença (Área exclusiva para convidados).
- **🎁 Lista de Presentes:** Criação de uma página de presentes divertida com integração para pagamento via PIX. (WIP)

---

## 🚧 Próximos Passos (O Que Falta Implementar)

Como ainda temos tempo até 2027, o site continuará crescendo. Aqui está o nosso Roadmap de desenvolvimento:

- [ ] **🔎 Aba "Dicas e Hospedagem":** Dicas de salão de beleza, maquiadoras ainda serão adicionadas
- [ ] **Lista de Presentes:** Possível adição de pagamento via cartão de crédito
- [ ] **Animações de Scroll (AOS):** Implementação da biblioteca _Animate On Scroll_ para que os elementos surjam suavemente conforme o usuário desce a página.

---

## 💻 Tecnologias Utilizadas

Este projeto optou por não usar frameworks pesados (como React ou Angular) neste primeiro momento, priorizando performance e controle fino do DOM.

- **Vite:** Ferramenta de build super rápida para o ambiente de desenvolvimento.
- **HTML5 / CSS3:** Utilizando amplamente Flexbox e Variáveis Nativas de CSS (`:root`).
- **JavaScript (Vanilla ES6+):** Código modularizado (`import/export`) separando as lógicas de contagem, calendário e interações da timeline.
- **Amazon Web Services (AWS):** Utilização de DynamoDB, AWS Lambda e AWS API Gateway para gerencimanento de logins
- **Fetch API (Async/Await):** Consumo assíncrono e nativo de requisições HTTP (RESTful). Utilizado para comunicação em tempo real com os endpoints da AWS e do Google sem a necessidade de recarregar a página.
- **Web Storage API (sessionStorage):** Gerenciamento inteligente de estado de autenticação no lado do cliente (Client-side Auth). Garante a persistência do login temporário e protege rotas privadas sem a dependência de bibliotecas externas ou cookies pesados.
- **Google Apps Script (Serverless):** Microserviço backend utilizado para capturar e processar os dados do formulário de RSVP (Confirmação de Presença), enviando as respostas diretamente para uma planilha na nuvem sem necessidade de gerenciar um banco de dados relacional.
- **Node.js & NPM:** Gerenciamento de pacotes e ambiente de execução base para a orquestração do Vite e compilação do projeto para produção (build).

---

## 🛠️ Como rodar este projeto localmente

Se você quiser clonar este projeto para dar uma olhada no código:

1. Clone o repositório:

   ```bash
   https://github.com/LeonardoScreminFeijo/wed.git

   ```

2. Entre na pasta do projeto:

   ```bash
   cd wed

   ```

3. Instale as dependências do Vite

   ```bash
   npm install

   ```

4. Configure as Variáveis de Ambiente:

Crie um arquivo chamado .env na raiz do projeto.

Copie o conteúdo do arquivo .env.example para dentro dele.

Substitua os valores falsos pelas suas próprias URLs de API (AWS e Google Apps Script).

Crie códigos PIX no seu banco de preferência (via pagamento por QRCode) e coloque o código na .env

5. Rode o servidor de desenvolvimento:
   npm run dev

6. Abra o link gerado no seu terminal (geralmente http://localhost:5173).

Desenvolvido por Leonardo Feijó.
