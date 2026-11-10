import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dist, html, allPages } from './helpers.mjs';

const pages = ['work/edgar-miner/index.html', 'work/fundraising-agent/index.html', 'work/thinkmocha/index.html'];

test('three appendix pages exist with inline status in the h1', () => {
  const want = { 'edgar-miner': '(prototype, in progress)', 'fundraising-agent': '(milestone 1 complete)', 'thinkmocha': '(paused)' };
  for (const p of pages) {
    const h1 = html(p).querySelector('h1').text.replace(/\s+/g, ' ').trim();
    assert.ok(h1.endsWith(want[p.split('/')[1]]), h1);
  }
});
test('sections appear in the spec order', () => {
  for (const p of pages) assert.deepEqual(html(p).querySelectorAll('main h2').map(h => h.text.trim().replace(/’/g, "'")), ['The problem', 'What I built', "How it's built", 'Where it is']);
});
test('edgar miner leads with the one-liner', () => assert.ok(html(pages[0]).querySelector('.summary').text.includes("reads every SEC filing so you don't have to")));
test('every appendix links back to the book', () => {
  for (const p of pages) assert.ok(html(p).querySelector('a.back[href="/#iv"]'), p);
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

test('appendix letter sits inside the h1, book-style', () => {
  const want = { 'edgar-miner': 'Appendix A.', 'fundraising-agent': 'Appendix B.', 'thinkmocha': 'Appendix C.' };
  for (const p of pages) {
    const h1 = html(p).querySelector('h1').text.replace(/\s+/g, ' ').trim();
    assert.ok(h1.startsWith(want[p.split('/')[1]]), h1);
  }
});
