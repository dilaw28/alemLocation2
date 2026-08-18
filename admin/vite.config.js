import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3001,
    watch:
      process.env.USE_POLLING === "true"
        ? { usePolling: true, interval: 300 }
        : undefined,
  },

  build: {
    outDir: "dist",

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react-router-dom")) {
            return "router";
          }

          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom")
          ) {
            return "vendor";
          }
        },
      },
    },
  },
});