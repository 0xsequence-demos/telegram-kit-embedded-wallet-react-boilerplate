import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [
    react({
      include: "**/*.tsx",
    }),
    vanillaExtractPlugin({}),
  ],
  server: {
    port: 4444,
  },
});
