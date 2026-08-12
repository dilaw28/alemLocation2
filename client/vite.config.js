import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Sur certains environnements Windows (antivirus, OneDrive), les
    // événements natifs de changement de fichier provoquent des erreurs
    // EPERM pendant le hot-reload. USE_POLLING=true force un mode plus
    // lent mais plus tolérant : `USE_POLLING=true npm run dev`
    watch: process.env.USE_POLLING === 'true'
      ? { usePolling: true, interval: 300 }
      : undefined,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // Sépare les librairies tierces (peu changées) du code applicatif
        // (change souvent) → le navigateur garde le vendor en cache entre
        // deux déploiements au lieu de tout re-télécharger.
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        },
      },
    },
  },
});
