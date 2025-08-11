import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
    },
  },
  define: {
    'process.env': {}
  },
  server: {
    port: process.env.PORT || 5173,
    host: '0.0.0.0',
    // Allow reverse proxies/healthcheck hosts during dev
    allowedHosts: [
      'healthcheck.railway.app',
      'leaad.co',
      'www.leaad.co',
    ],
  },
  // Vite preview (used in production preview/serve) host allowlist
  preview: {
    port: process.env.PORT || 5173,
    host: '0.0.0.0',
    allowedHosts: [
      'healthcheck.railway.app',
      'leaad.co',
      'www.leaad.co',
    ],
  }
});
