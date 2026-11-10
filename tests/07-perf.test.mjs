import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dist, html, text, allPages } from './helpers.mjs';

const allCss = () => readdirSync(dist('_astro')).filter(f => f.endsWith('.css')).map(f => text(`_astro/${f}`)).join('');

test('home has at most one script, and it is the running header', () => {
  const s = html('index.html').querySelectorAll('script');
  assert.ok(s.length <= 1, `${s.length} scripts`);
  if (s.length) assert.match(s[0].text, /IntersectionObserver/);
});
test('home ships the running header', () => {
  assert.ok(html('index.html').querySelector('header.running [data-running]'));
});
test('appendix pages ship zero scripts', () => {
  for (const p of ['work/edgar-miner/index.html']) assert.equal(html(p).querySelectorAll('script').length, 0);
});
test('images are lazy, async, and sized', () => {
  for (const p of allPages()) for (const img of html(p).querySelectorAll('img')) {
    assert.equal(img.getAttribute('loading'), 'lazy', p);
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

test('anchor targets clear the fixed running header', () => {
  const css = allCss();
  assert.match(css, /\.chapter[^{]*\{[^}]*scroll-margin-top/s);
  assert.match(css, /#contents[^{]*\{[^}]*scroll-margin-top|\.contents[^{]*\{[^}]*scroll-margin-top/s);
});
test('serif fallback is metric-adjusted and the Latin face is preloaded', () => {
  assert.match(allCss(), /font-family:\s*["']?Literata Fallback["']?[^}]*size-adjust/s);
  const link = html('index.html').querySelector('link[rel="preload"][as="font"]');
  assert.ok(link && /literata-latin-wght-normal.*\.woff2$/.test(link.getAttribute('href')), 'preload link');
});
