import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [tailwindcss(), react()],
    server: {
      proxy: {
        "/api": {
          target:
            env.VITE_API_URL || "https://hireflow-backend-obv1.onrender.com",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        },
      },
    },
  };
});
