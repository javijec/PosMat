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

          const packagePath = id.split("node_modules/")[1];
          const [scopeOrName, scopedName] = packagePath.split("/");
          const packageName = scopeOrName.startsWith("@")
            ? `${scopeOrName}/${scopedName}`
            : scopeOrName;

          if (["react", "react-dom", "scheduler"].includes(packageName)) {
            return "vendor-react";
          }

          if (["react-router", "react-router-dom"].includes(packageName) || packageName.startsWith("@remix-run/")) {
            return "vendor-router";
          }

          if (packageName.startsWith("@tanstack/")) {
            return "vendor-query";
          }

          if (packageName === "@headlessui/react") {
            return "vendor-headlessui";
          }

          if (packageName === "react-hook-form" || packageName.startsWith("@hookform/") || packageName === "zod") {
            return "vendor-forms";
          }

          if (packageName.startsWith("@tiptap/") || packageName === "prosemirror-view" || packageName.startsWith("prosemirror-")) {
            return "vendor-tiptap";
          }

          if (
            packageName === "recharts" ||
            packageName === "recharts-scale" ||
            packageName === "react-smooth" ||
            packageName === "victory-vendor" ||
            packageName === "eventemitter3" ||
            packageName === "lodash" ||
            packageName === "react-is" ||
            packageName === "tiny-invariant" ||
            packageName === "clsx" ||
            packageName.startsWith("d3-")
          ) {
            return "vendor-charts";
          }

          if (packageName === "lucide-react" || packageName.startsWith("@fortawesome/")) {
            return "vendor-icons";
          }

          if (packageName === "framer-motion" || packageName === "motion-dom" || packageName === "motion-utils") {
            return "vendor-motion";
          }

          return "vendor";
        },
      },
    },
  },
});
