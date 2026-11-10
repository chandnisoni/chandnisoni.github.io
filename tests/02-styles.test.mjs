import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dist, html, text, allPages } from './helpers.mjs';

const cssFiles = () => readdirSync(dist('_astro')).filter(f => f.endsWith('.css'));
const allCss = () => cssFiles().map(f => text(`_astro/${f}`)).join('');

test('no Google Fonts requests; fonts are self-hosted', () => {
  for (const p of allPages()) assert.doesNotMatch(text(p), /fonts\.(googleapis|gstatic)\.com/);
  assert.ok(readdirSync(dist('_astro')).some(f => /literata.*\.woff2$/i.test(f)));
});
test('no gradients anywhere in shipped CSS', () => {
  for (const f of cssFiles()) assert.doesNotMatch(text(`_astro/${f}`), /gradient\(/);
});
test('tokens are the spec values', () => {
  const css = allCss().toUpperCase();
  for (const v of ['#F7F2E8', '#EDE5D6', '#1E1A15', '#5B544A', '#D8CEBC', '#D9622B']) assert.ok(css.includes(v), v);
});
test('404 page exists and links home', () => assert.ok(html('404.html').querySelector('a[href="/"]')));
