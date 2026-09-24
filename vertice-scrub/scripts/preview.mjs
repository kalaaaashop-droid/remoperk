/**
 * Genera un único HTML autocontenido de la web (para verla como página en Claude).
 * Uso: npm run preview  →  preview-dist/vertice-scrub.html
 */
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

mkdirSync("preview-dist", { recursive: true });

execFileSync("npx", ["@tailwindcss/cli", "-i", "app/globals.css", "-o", "preview-dist/app.css", "--minify"], { stdio: "inherit" });

const { outputFiles } = await build({
  entryPoints: ["preview/main.tsx"],
  bundle: true,
  minify: true,
  write: false,
  format: "iife",
  tsconfigRaw: { compilerOptions: { jsx: "react" } },
  jsx: "transform",
  jsxFactory: "React.createElement",
  jsxFragment: "React.Fragment",
  inject: ["preview/react-inject.js"],
  alias: { react: "./preview/react-shim.ts", "@": "." },
  define: { "process.env.NODE_ENV": '"production"' },
});

const css = readFileSync("preview-dist/app.css", "utf8");
const js = outputFiles[0].text.replace(/<\/script/gi, "<\\/script");

const html = `<title>Vértice.scrub</title>
<meta name="description" content="Configurador de uniformes médicos Vértice.scrub">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap">
<style>
:root{--font-cormorant:"Cormorant Garamond";--font-manrope:"Manrope";color-scheme:light}
${css}
body>header,#app>header{top:env(safe-area-inset-top,0px)}
</style>
<div id="app"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script>${js}</script>
`;

writeFileSync("preview-dist/vertice-scrub.html", html);
console.log(`preview-dist/vertice-scrub.html · ${(html.length / 1024).toFixed(0)} KB`);
