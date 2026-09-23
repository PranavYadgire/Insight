import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// Trello Power-Ups require distinct HTML entry points for the connector
// and each popup/modal iframe. Vite's rollupOptions multi-page build
// compiles each entry point cleanly.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    rollupOptions: {
      input: {
  main: resolve(__dirname, "index.html"),
  powerup: resolve(__dirname, "powerup.html"),
  auth: resolve(__dirname, "auth.html"),
  dashboard: resolve(__dirname, "dashboard.html"),
},
    },
  },
  server: {
    port: 5173,
    cors: true,
  },
});
