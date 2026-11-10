import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { parse } from 'node-html-parser';

const DIST = resolve(process.env.DIST_DIR ?? 'dist');

export const dist = (rel) => join(DIST, rel);
export const text = (rel) => readFileSync(dist(rel), 'utf8');
export const html = (rel) => parse(text(rel));
export function allPages(dir = DIST) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...allPages(p));
    else if (name.endsWith('.html')) out.push(relative(DIST, p));
  }
  return out.sort();
}
