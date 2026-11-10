import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dist, html, text } from './helpers.mjs';

test('with only a draft post: no nav link, index says so, draft page not built, feed valid and empty', () => {
  assert.equal(html('index.html').querySelectorAll('nav.site a[href^="/writing"]').length, 0);
  assert.match(html('writing/index.html').querySelector('main').text, /Nothing here yet/);
  assert.ok(!existsSync(dist('writing/hello/index.html')));
  const xml = text('rss.xml');
  assert.match(xml, /<rss/);
  assert.doesNotMatch(xml, /<item>/);
});

test('with one published post: nav shows Writing, index lists it, feed has one item, page has the YouTube button', () => {
  const r = spawnSync('node', ['tests/fixtures/build-with-published-post.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const out = JSON.parse(r.stdout);
  assert.equal(out.navHasWriting, true);
  assert.deepEqual(out.indexTitles, ['Fixture post']);
  assert.equal(out.items, 1);
  assert.equal(out.hasYtButton, true);
  assert.equal(out.iframes, 0);
});
