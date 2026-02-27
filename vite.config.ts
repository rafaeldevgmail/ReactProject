import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      ".csb.app", // Autoriza o CodeSandbox a exibir o app
    ],
    host: true, // Garante que o servidor aceite conexões externas
  },
});
