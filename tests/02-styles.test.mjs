import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dist, html, text, allPages } from './helpers.mjs';

const cssFiles = () => readdirSync(dist('_astro')).filter(f => f.endsWith('.css'));
const allCss = () => cssFiles().map(f => text(`_astro/${f}`)).join('');

test('no Google Fonts requests; fonts are self-hosted', () => {
  for (const p of allPages()) assert.doesNotMatch(text(p), /fonts\.(googleapis|gstatic)\.com/);
  assert.ok(readdirSync(dist('_astro')).some(f => /quicksand.*\.woff2$/i.test(f)));
});
test('no gradients anywhere in shipped CSS', () => {
  for (const f of cssFiles()) assert.doesNotMatch(text(`_astro/${f}`), /gradient\(/);
});
test('tokens are the spec values', () => {
  const css = allCss().toUpperCase();
  for (const v of ['#FBF5E4', '#F3E8C9', '#2A2416', '#655B46', '#E6D9B6', '#E2B04A', '#8A5A14']) assert.ok(css.includes(v), v);
});
test('body is Quicksand at a readable weight and the page says so', () => {
  assert.match(allCss(), /body\s*\{[^}]*font-weight:\s*500/s);
  assert.match(html('index.html').querySelector('.colophon').text, /Set in Quicksand/);
});
test('404 page exists and links home', () => assert.ok(html('404.html').querySelector('a[href="/"]')));
