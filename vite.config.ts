import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [
    react({
      include: "**/*.tsx",
    }),
  ],
  server: {
    port: 4444,
  },
});
