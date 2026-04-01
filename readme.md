# 💍 Site de Casamento | Ana & Leo

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-fd5d3d?style=for-the-badge)
![Tecnologia](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tecnologia](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Bem-vindo ao repositório do nosso site de casamento! Este projeto está sendo construído com muito carinho para celebrar o nosso grande dia, que acontecerá em **24 de Abril de 2027**, na Chácara Doce Recanto (Curitiba - PR).

O objetivo deste site é centralizar todas as informações para os nossos convidados, proporcionando uma experiência digital fluida, moderna e responsiva, com um design baseado na paleta "Tropical Chic" (Vinho, Coral, Laranja e Amarelo).

---

## 🚀 O Que Já Tem (Recursos Implementados)

A base do site (Front-end) já está construída utilizando uma arquitetura modular e boas práticas de **Clean Code**, focando na responsividade (Mobile-First).

- **🎨 UI/UX Responsiva:** Layout flexível com uma Sidebar (Menu Lateral) no desktop que se transforma em um menu superior compacto em dispositivos móveis.
- **⏱️ Contagem Regressiva em Tempo Real:** Um relógio dinâmico construído em JavaScript que calcula os dias, horas, minutos e segundos até o "Sim".
- **📅 Integração com Google Agenda:** Botão interativo que gera automaticamente um evento na agenda do convidado com data, horário, local e descrição do casamento.
- **🗺️ Mapa Integrado (Safe iframe):** Google Maps da chácara embarcado nativamente com travas de CSS (`max-width` e `flex-shrink`) para garantir que não quebre o layout em telas menores.
- **📖 Timeline Interativa "Z-Pattern" (Nossa História):** Uma linha do tempo desenvolvida do zero (sem bibliotecas externas) onde os convidados clicam em uma foto para ler aquele capítulo da história. Conta com animações suaves de zoom, transparência e desfoque dinâmico (Blur/Grayscale) nos itens inativos.
- **Rodapé (Footer):** Fechamento do site com nossas iniciais e um design elegante.
- **Aba "Dicas e Hospedagem":** Uma seção de FAQ alertando sobre hotéis, salões de beleza e logística. (WIP)

---

## 🚧 Próximos Passos (O Que Falta Implementar)

Como ainda temos tempo até 2027, o site continuará crescendo. Aqui está o nosso Roadmap de desenvolvimento:

- [ ] **Lista de Presentes:** Integração com plataformas de cotas de lua de mel ou link para presentes físicos.
- [ ] **Confirmação de Presença (RSVP):** Formulário integrado (via API, Firebase ou Google Forms) para os convidados confirmarem presença.
- [ ] **Animações de Scroll (AOS):** Implementação da biblioteca _Animate On Scroll_ para que os elementos surjam suavemente conforme o usuário desce a página.

---

## 💻 Tecnologias Utilizadas

Este projeto optou por não usar frameworks pesados (como React ou Angular) neste primeiro momento, priorizando performance e controle fino do DOM.

- **Vite:** Ferramenta de build super rápida para o ambiente de desenvolvimento.
- **HTML5 / CSS3:** Utilizando amplamente Flexbox e Variáveis Nativas de CSS (`:root`).
- **JavaScript (Vanilla ES6+):** Código modularizado (`import/export`) separando as lógicas de contagem, calendário e interações da timeline.

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

4. Rode o servidor de desenvolvimento:
   npm run dev

5. Abra o link gerado no seu terminal (geralmente http://localhost:5173).

Desenvolvido por Leonardo Feijó.
