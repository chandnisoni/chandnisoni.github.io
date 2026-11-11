import { existsSync } from 'node:fs';
import { join } from 'node:path';

// Resolved from the project root, not import.meta.url: the bundled module lives under dist/ or .astro/ at build time.
const publicDir = join(process.cwd(), 'public');

/** Throws at build time if `src` (a site-absolute path like `/images/x.webp`) is not in `public/`. */
export function assertImageExists(src: string): void {
  if (!src.startsWith('/') || !existsSync(join(publicDir, src.replace(/^\//, '')))) {
    throw new Error(`Missing image: ${src}`);
  }
}
