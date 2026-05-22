import { defineConfig, loadEnv } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig(({ mode }) => {
  // Carrega TODAS as variáveis do .env, inclusive sem prefixo VITE_
  // DEV_LOGIN e DEV_SENHA nunca chegam ao bundle do browser
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      {
        name: "dev-login-mock",
        configureServer(server) {
          server.middlewares.use("/api/dev-login", (req, res) => {
            if (req.method !== "POST") {
              res.statusCode = 405;
              res.end();
              return;
            }
            let body = "";
            req.on("data", (chunk) => (body += chunk));
            req.on("end", () => {
              try {
                const { login, senha } = JSON.parse(body);
                // Só autentica se DEV_LOGIN estiver configurado no .env
                const credenciaisOk =
                  env.DEV_LOGIN &&
                  login === env.DEV_LOGIN &&
                  senha === env.DEV_SENHA;
                res.setHeader("Content-Type", "application/json");
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.end(
                  JSON.stringify(
                    credenciaisOk
                      ? { sucesso: true }
                      : { sucesso: false, mensagem: "Credenciais inválidas" }
                  )
                );
              } catch {
                res.statusCode = 400;
                res.end();
              }
            });
          });
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          dicas: resolve(__dirname, "dicas.html"),
          gifts: resolve(__dirname, "gifts.html"),
          mural: resolve(__dirname, "mural.html"),
          nossaHistoria: resolve(__dirname, "nossa-historia.html"),
          rsvp: resolve(__dirname, "rsvp.html"),
          admin: resolve(__dirname, "admin.html"),
          fotos: resolve(__dirname, "fotos.html"),
        },
      },
    },
  };
});
