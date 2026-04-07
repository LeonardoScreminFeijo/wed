import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        dicas: resolve(__dirname, "dicas.html"),
        gifts: resolve(__dirname, "gifts.html"),
        mural: resolve(__dirname, "mural.html"),
        nossaHistoria: resolve(__dirname, "nossa-historia.html"),
        rsvp: resolve(__dirname, "rsvp.html"),
      },
    },
  },
});
