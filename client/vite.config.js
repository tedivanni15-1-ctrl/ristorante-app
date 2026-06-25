import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Tutte le chiamate /api vengono girate al backend Express
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
