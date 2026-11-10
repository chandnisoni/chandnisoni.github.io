import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const publicDir = fileURLToPath(new URL('../../public/', import.meta.url));

/** Throws at build time if `src` (a site-absolute path like `/images/x.webp`) is not in `public/`. */
export function assertImageExists(src: string): void {
  const rel = src.replace(/^\//, '');
  if (!src.startsWith('/') || !existsSync(publicDir + rel)) {
    throw new Error(`Missing image: ${src}`);
  }
}
