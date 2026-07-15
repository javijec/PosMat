import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;

          if (id.includes("react") || id.includes("react-dom")) {
            return "vendor-react";
          }

          if (id.includes("react-router-dom") || id.includes("@remix-run")) {
            return "vendor-router";
          }

          if (id.includes("@tanstack/react-query")) {
            return "vendor-query";
          }

          if (id.includes("@headlessui/react")) {
            return "vendor-headlessui";
          }

          if (id.includes("react-hook-form") || id.includes("@hookform") || id.includes("zod")) {
            return "vendor-forms";
          }

          if (id.includes("@tiptap")) {
            return "vendor-tiptap";
          }

          if (id.includes("recharts") || id.includes("d3-")) {
            return "vendor-charts";
          }

          if (id.includes("lucide-react") || id.includes("@fortawesome")) {
            return "vendor-icons";
          }

          if (id.includes("framer-motion")) {
            return "vendor-motion";
          }

          return "vendor";
        },
      },
    },
  },
});
