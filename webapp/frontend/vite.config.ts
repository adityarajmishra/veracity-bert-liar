import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Root-relative alias — avoids any dependency on Node typings.
    alias: { "@": "/src" },
  },
  server: {
    port: 5173,
  },
});
