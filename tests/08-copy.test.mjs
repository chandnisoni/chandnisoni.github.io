import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
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
  assert.match(t, /my (daughter|then three-year-old)/i);
  assert.doesNotMatch(t, /my (daughter|then three-year-old),?\s+[A-Z][a-z]+/, 'a name follows the daughter mention');
});
// The consistency table from linkedin-updates.md, vendored so this guard runs in CI too.
const VENDORED = 'tests/fixtures/consistency-table.md';
const LOCAL = '/Users/chandni/work/life/linkedin-updates.md';
const tableRows = (md) => md.split('\n').filter((l) => /^\|.*\|.*\|.*\|$/.test(l) && !/^\|\s*-/.test(l));

test('vendored consistency table matches the local linkedin-updates.md', { skip: !existsSync(LOCAL) && 'linkedin-updates.md not on this machine' }, () => {
  assert.deepEqual(tableRows(readFileSync(VENDORED, 'utf8')), tableRows(readFileSync(LOCAL, 'utf8')));
});
test('metrics on the site all appear in the LinkedIn consistency table', () => {
  const table = readFileSync(VENDORED, 'utf8');
  const site = allPages().map(bodyText).join(' ');
  for (const m of ['50+', '90%', '98%', '95%', '10,000+', '80%', '20 hours', '2 hours']) {
    if (site.includes(m)) assert.ok(table.includes(m.replace(' hours', '')), m);
  }
});
test('appendix pages carry the numerals the cross-check needs', () => {
  const t = bodyText('work/talewriter/index.html') + bodyText('work/fundraising-agent/index.html');
  for (const m of ['50+', '90%+', '20 hours', '2 hours']) assert.ok(t.includes(m), m);
});

test('home copy states metrics the way the resume does', () => {
  const t = bodyText('index.html');
  assert.match(t, /cut processing time (by )?98%/, 'billing metric is a time cut, not "faster"');
  assert.doesNotMatch(t, /98% faster|98 percent faster/i);
  assert.match(t, /infrastructure costs (by )?80%/);
});
test('no adjectives about myself', () => {
  for (const p of allPages()) assert.doesNotMatch(bodyText(p), /\b(driven|visionary|results-oriented|builder at heart|self-starter)\b/i, p);
});
test('no relative-time phrases that expire', () => {
  for (const p of allPages()) assert.doesNotMatch(bodyText(p), /\b(earlier|later) this year\b|\blast year\b/i, p);
});
