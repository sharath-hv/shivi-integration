/**
 * Resolves a path to `/public` so it works with any Vite `base` (e.g. GitHub Pages).
 * Absolute http(s) URLs are returned unchanged.
 */
export function publicUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const base = import.meta.env.BASE_URL;
  const withoutLeading = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${withoutLeading}`;
}
