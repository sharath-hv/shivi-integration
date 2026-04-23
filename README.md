# Shivi integration

Workspace for ACKO Drive **Shivi** UX layer work: prototype web app, design notes, and reusable **skills** (design-system rules).

## Repository layout

| Path | Purpose |
|------|--------|
| `web/` | Vite + React + TypeScript app (`npm run dev` from `web/`) |
| `docs/` | Product / UX documentation |
| `skills/` | ACKO design-system reference (typography, layout, motion, tokens, **SKILL** orchestrator) |
| `fonts/` | Optional reference CSS (e.g. CDN font-face). **Not** wired to the Vite app by default — see [Fonts](#fonts) below. |

## Quick start (web)

```bash
cd web
npm install
npm run dev
```

Build (local, default base `/`):

```bash
cd web
npm run build
```

For GitHub Pages–style build (subpath), set `VITE_BASE_PATH` to `/<repo-name>/` before `npm run build` (see [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml)).

---

## Fonts

### How fonts are applied in the **web** app (source of truth)

1. **Face definitions** live in [`web/src/fonts.css`](web/src/fonts.css) — family name **`"Euclid Circular B"`**, weights 300–700, with `local(...)` and `url(...)` fallbacks.
2. **Global use** is set in [`web/src/index.css`](web/src/index.css) via:
   - `--font-sans: "Euclid Circular B", -apple-system, BlinkMacSystemFont, sans-serif;`
   - `body { font-family: var(--font-sans); }`
3. **Imports** in [`web/src/main.tsx`](web/src/main.tsx): `./fonts.css` is imported **before** `./index.css` so faces load first.
4. **Binary files** (`.woff2` / `.otf`) go under **`web/public/fonts/`** — see [`web/public/fonts/README.txt`](web/public/fonts/README.txt). The bundler and GitHub Pages `base` path resolve `/fonts/...` correctly in dev and production when files exist.

### Basic rules (web)

- **Do not** add a second, conflicting `@font-family` for body copy without aligning names and weights with `fonts.css` + `--font-sans`.
- **Do not** rely on the repo-root [`fonts/font-euclid.css`](fonts/font-euclid.css) for the Vite app unless you explicitly import or link it; the app is driven by `web/src/fonts.css` and a different **family name** in that file would fight `"Euclid Circular B"`.
- **Screen / flow pages** that intentionally override the default shell (e.g. Shivi on white) set `font-family: var(--font-sans)` in their own CSS to stay on Euclid.
- If webfonts are missing, the stack falls back to system fonts; add licensed files to `web/public/fonts/` to get full Euclid in all environments.

### Alignment with `skills/typography.md`

The skills doc describes **ACKO product** usage (e.g. `Typography` from packages). This repo’s prototype uses **plain CSS** + the stack above, but the **scale and tone** in [`skills/typography.md`](skills/typography.md) (weights, hierarchy, not raw ad-hoc sizes) still apply when you add or change text styles.

---

## Skills (design system rules)

### Where to start

1. Open **[`skills/SKILL.md`](skills/SKILL.md)** — orchestrator, token architecture, product personality, and **hard constraints** (what never to do).
2. Use the layered model:
   - **`primitives.md`** — raw values (color, spacing, type scale references).
   - **`semantics.md`** — meaning / roles mapped from primitives.
   - **Component / surface docs** (e.g. `cards.md`, `forms-controls.md`, `layout.md`, **`typography.md`**, `motion.md`).

**Rule of thumb:** Prefer **semantics and component rules** over raw primitives in UI; never skip the layer story described in `SKILL.md` when you extend design.

### Basic rules when applying skills to this project

- **One source of style truth per concern** — tokens and motion rules in `skills/` are the spec; the **web** app implements them in CSS/TS; avoid inventing a parallel scale without updating skills or documenting an exception in `docs/`.
- **Typography:** follow hierarchy and “no random font-size” discipline from `typography.md`; in code use shared classes or variables (`--font-sans`, page-level type tokens) instead of one-off `font-size` on every node.
- **Layout & touch:** `layout.md` and `touch-accessibility.md` for spacing, hit targets, and safe areas on mobile.
- **Motion:** `motion.md` — avoid `transition: all` and unbounded `z-index` (as in `SKILL.md`); match easing/duration to documented patterns when adding Framer or CSS motion.
- **Figma / shipped UI parity** — when matching Figma, cross-check `iconography.md`, `ui-polish.md`, and color tokens in `primitives.md` / `semantics.md`.

This repo is a **lightweight** implementation: not every `@acko/*` package API in `skills/*.md` exists here, but the **discipline** (clarity, tokens, accessibly sized targets, consistent type) is the same.

---

## Other documentation

- [Shivi UX Layer — design brief analysis](docs/shivi-ux-layer-design-brief-analysis.md) — strategic framing, six surfaces, sequencing, and build implications from the design brief.
