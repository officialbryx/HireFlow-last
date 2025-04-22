import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    proxy: {
      "/api": {
        target: "https://hireflow-backend-obv1.onrender.com",
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on("error", (err, req, res) => {
            console.error("Proxy error:", err);
          });
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
