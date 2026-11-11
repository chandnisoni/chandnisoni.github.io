import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dist, html, text } from './helpers.mjs';

const page = 'work/talewriter/index.html';
const allCss = () => readdirSync(dist('_astro')).filter(f => f.endsWith('.css')).map(f => text(`_astro/${f}`)).join('');

test('talewriter wraps the pages in a book viewer with prev/next controls', () => {
  const d = html(page);
  const book = d.querySelector('[data-book]');
  assert.ok(book, 'data-book');
  assert.equal(book.querySelectorAll('figure.page').length, 5);
  assert.ok(book.querySelector('button[data-prev]') && book.querySelector('button[data-next]'));
  assert.ok(book.querySelector('[data-count]'));
});
test('the viewer is the only script on the page and it respects reduced motion', () => {
  const s = html(page).querySelectorAll('script');
  assert.equal(s.length, 1);
  assert.match(s[0].text, /prefers-reduced-motion/);
  assert.match(s[0].text, /ArrowRight/);
});
test('the flip is a 3D turn around the spine, and pages still stack without JS', () => {
  const css = allCss();
  assert.match(css, /\.book[^{]*\{[^}]*perspective/s);
  assert.match(css, /backface-visibility:\s*hidden/);
  assert.match(css, /rotateY\(-180deg\)/);
  // Without JS (no .js class) nothing is hidden: the hiding rule is scoped to .book.js
  assert.doesNotMatch(css, /\.book:not\(\.js\)[^}]*display:\s*none/);
  assert.match(css, /\.book\.js[^{]*\{[^}]*display:\s*none/s);
});
test('the cover is the largest paint: fetchpriority high, preloaded, and every page has a responsive srcset', () => {
  const d = html(page);
  const cover = d.querySelector('[data-book] .page[data-page="0"] img');
  assert.equal(cover.getAttribute('fetchpriority'), 'high');
  assert.ok(d.querySelector(`link[rel="preload"][as="image"][href="${cover.getAttribute('src')}"]`), 'cover preload');
  for (const img of d.querySelectorAll('[data-book] img')) {
    assert.match(img.getAttribute('srcset') ?? '', /-800\.webp 800w, .*\.webp 1600w/);
    assert.ok(img.getAttribute('sizes'));
  }
});
