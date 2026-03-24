import fs from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/** En dev sirve los HTML bajo Wireframes/ para el iframe de comparación con el diseño. */
function wireframesDevPlugin(): Plugin {
  const rootWireframes = path.join(process.cwd(), "Wireframes");
  return {
    name: "repse-wireframes-static",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split("?")[0] ?? "";
        if (!url.startsWith("/Wireframes/")) return next();
        const rel = decodeURIComponent(url.slice("/Wireframes/".length));
        if (!rel || rel.includes("..")) return next();
        const filePath = path.join(rootWireframes, rel);
        if (!filePath.startsWith(rootWireframes)) return next();
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return next();
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.end(fs.readFileSync(filePath));
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), wireframesDevPlugin()],
});
