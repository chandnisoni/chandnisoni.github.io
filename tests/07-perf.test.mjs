import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dist, html, text, allPages } from './helpers.mjs';

const allCss = () => readdirSync(dist('_astro')).filter(f => f.endsWith('.css')).map(f => text(`_astro/${f}`)).join('');

test('home and work pages ship zero scripts', () => {
  for (const p of ['index.html', 'work/edgar-miner/index.html']) assert.equal(html(p).querySelectorAll('script').length, 0, p);
});
test('images are lazy, async, and sized (a book cover may load eagerly: it is the largest paint)', () => {
  for (const p of allPages()) for (const img of html(p).querySelectorAll('img')) {
    const cover = img.closest('[data-book] .page[data-page="0"]');
    assert.equal(img.getAttribute('loading'), cover ? 'eager' : 'lazy', p);
    assert.equal(img.getAttribute('decoding'), 'async', p);
    assert.ok(img.getAttribute('width') && img.getAttribute('height'), p);
  }
});
test('reduced motion disables all transitions and animations', () => {
  assert.match(allCss(), /@media\s*\(prefers-reduced-motion:\s*reduce\)[^}]*\{[^}]*(animation|transition)[^}]*none/s);
});
test('fonts use font-display swap', () => {
  assert.match(allCss(), /font-display:\s*swap/);
});

test('serif fallback is metric-adjusted and the Latin face is preloaded', () => {
  assert.match(allCss(), /font-family:\s*["']?Literata Fallback["']?[^}]*size-adjust/s);
  const link = html('index.html').querySelector('link[rel="preload"][as="font"]');
  assert.ok(link && /literata-latin-wght-normal.*\.woff2$/.test(link.getAttribute('href')), 'preload link');
});
