import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { html, allPages } from './helpers.mjs';

const BANNED = ['unlock', 'transform', 'elevate', 'empower', 'leverage', 'seamless', 'innovative', 'passionate', 'journey'];
const bodyText = (p) => html(p).querySelector('body').text;

test('no banned words on any page', () => {
  for (const p of allPages()) {
    const t = bodyText(p).toLowerCase();
    for (const w of BANNED) assert.doesNotMatch(t, new RegExp(`\\b${w}\\b`), `${p}: ${w}`);
  }
});
test('no competitor name, no "paused for the MBA"', () => {
  for (const p of allPages()) assert.doesNotMatch(bodyText(p), /story\s?heroes|paused for the MBA/i, p);
});
test('daughter is anonymous', () => {
  const t = bodyText('index.html');
  assert.match(t, /my daughter/i);
  assert.doesNotMatch(t, /my daughter,?\s+[A-Z][a-z]+/, 'a name follows "my daughter"');
});
test('metrics on the site all appear in the LinkedIn consistency table', () => {
  const table = readFileSync('/Users/chandni/work/life/linkedin-updates.md', 'utf8');
  const site = allPages().map(bodyText).join(' ');
  for (const m of ['50+', '90%', '98%', '95%', '10,000+', '80%', '20 hours', '2 hours']) {
    if (site.includes(m)) assert.ok(table.includes(m.replace(' hours', '')), m);
  }
});
test('appendix pages carry the numerals the cross-check needs', () => {
  const t = bodyText('work/thinkmocha/index.html') + bodyText('work/fundraising-agent/index.html');
  for (const m of ['50+', '90%+', '20 hours', '2 hours']) assert.ok(t.includes(m), m);
});
