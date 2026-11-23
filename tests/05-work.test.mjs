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

test('fundraising agent shows the narrated demo recording: a real file, a poster, controls, sound on, no loop', () => {
  const d = html('work/fundraising-agent/index.html');
  const v = d.querySelector('main video');
  assert.ok(v, 'a video element');
  assert.equal(v.getAttribute('src'), '/videos/fundraising-agent.mp4');
  assert.ok(existsSync(dist('videos/fundraising-agent.mp4')), 'mp4 shipped');
  assert.equal(v.getAttribute('poster'), '/images/fundraising-agent-poster.webp');
  assert.ok(existsSync(dist('images/fundraising-agent-poster.webp')), 'poster shipped');
  assert.ok(v.hasAttribute('controls'));
  assert.equal(v.getAttribute('preload'), 'metadata');
  for (const a of ['muted', 'loop', 'autoplay']) assert.ok(!v.hasAttribute(a), `no ${a}: the demo is narrated`);
  assert.ok(v.getAttribute('aria-label')?.length > 20);
  assert.match(d.querySelector('main figcaption').text, /\S{10,}/);
});
