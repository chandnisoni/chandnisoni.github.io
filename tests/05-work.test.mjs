import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dist, html, allPages } from './helpers.mjs';

const pages = ['work/edgar-miner/index.html', 'work/fundraising-agent/index.html', 'work/thinkmocha/index.html'];

test('three work pages exist and the h1 is just the title', () => {
  const want = { 'edgar-miner': 'Edgar Miner', 'fundraising-agent': 'Fundraising Agent', 'thinkmocha': 'ThinkMocha storybooks' };
  for (const p of pages) assert.equal(html(p).querySelector('h1').text.replace(/\s+/g, ' ').trim(), want[p.split('/')[1]], p);
});
test('sections appear in the spec order', () => {
  for (const p of pages) assert.deepEqual(html(p).querySelectorAll('main h2').map(h => h.text.trim().replace(/’/g, "'")), ['The problem', 'What I built', "How it's built", 'Where it is']);
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

