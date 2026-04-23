import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// GitHub Pages: https://<user>.github.io/<repo>/
// CI should set VITE_BASE_PATH=/<repo>/ (see .github/workflows/deploy-github-pages.yml).
const GITHUB_PAGES_BASE = process.env.VITE_BASE_PATH || "/";

const isSrcFontsCss = (id: string) => /[/\\]src[/\\]fonts\.css$/.test(id);

function fontUrlsPlugin(base: string): Plugin {
  return {
    name: "gh-pages-font-urls",
    transform(code, id) {
      if (isSrcFontsCss(id)) {
        return code.replace(/url\(\s*["']?\/fonts\//g, `url("${base}fonts/`);
      }
    },
  };
}

function indexHtmlBasePlugin(base: string): Plugin {
  return {
    name: "gh-pages-index-html-base",
    transformIndexHtml(html) {
      return html.replace(
        'href="/fonts/',
        `href="${base}fonts/`,
      );
    },
  };
}

export default defineConfig({
  base: GITHUB_PAGES_BASE,
  plugins: [react(), fontUrlsPlugin(GITHUB_PAGES_BASE), indexHtmlBasePlugin(GITHUB_PAGES_BASE)],
});
