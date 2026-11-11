import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dist, html, allPages } from './helpers.mjs';

const pages = ['work/edgar-miner/index.html', 'work/fundraising-agent/index.html', 'work/talewriter/index.html'];

test('three work pages exist and the h1 is just the title', () => {
  const want = { 'edgar-miner': 'Edgar Miner', 'fundraising-agent': 'Fundraising Agent', 'talewriter': 'Talewriter' };
  for (const p of pages) assert.equal(html(p).querySelector('h1').text.replace(/\s+/g, ' ').trim(), want[p.split('/')[1]], p);
});
test('work pages are vision pages: no section headings, no stack line, no build or status talk', () => {
  for (const p of pages) {
    const d = html(p);
    assert.equal(d.querySelectorAll('main h2').length, 0, p);
    assert.equal(d.querySelectorAll('.stack').length, 0, p);
    assert.doesNotMatch(d.querySelector('main').text, /what i built|how it's built|how it’s built|where it is|prototype|milestone|paused|stack:/i, p);
  }
});
test('edgar miner leads with the one-liner', () => assert.ok(html(pages[0]).querySelector('.summary').text.includes("reads every SEC filing so you don't have to")));
test('every work page links back home', () => {
  for (const p of pages) assert.ok(html(p).querySelector('a.back[href="/"]'), p);
});
test('every image on every page resolves to a shipped file', () => {
  for (const p of allPages()) for (const img of html(p).querySelectorAll('img')) {
    const src = img.getAttribute('src');
    assert.ok(src && existsSync(dist(src.replace(/^\//, ''))), `${p}: ${src}`);
  }
});
test('a work entry pointing at a missing image fails the build', () => {
  const r = spawnSync('node', ['tests/fixtures/build-with-bad-image.mjs'], { encoding: 'utf8' });
  assert.notEqual(r.status, 0);
  assert.match(r.stderr + r.stdout, /Missing image: \/images\/does-not-exist\.webp/);
});

