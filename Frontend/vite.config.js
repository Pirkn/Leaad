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
  build: {
    // Ensure assets are properly handled
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/webm|mp4|ogg|mov/i.test(ext)) {
            return `assets/videos/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
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
