// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   envPrefix: 'VITE_'
// })
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Optional: Specify local development port
  },
  build: {
    outDir: "dist", // Ensure the output directory is `dist`
  },
});
