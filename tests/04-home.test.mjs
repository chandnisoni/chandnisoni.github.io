import { test } from 'node:test';
import assert from 'node:assert/strict';
import { html, allPages } from './helpers.mjs';

const doc = () => html('index.html');
const mainText = () => doc().querySelector('main').text.replace(/\s+/g, ' ').trim();

test('home opens with the greeting and the one-line purpose', () => {
  assert.equal(doc().querySelector('main h1').text.trim(), "Hi, I'm Chandni.");
  assert.match(mainText(), /I'm an engineer who keeps starting companies\./);
});
test('home is one short column: under 500 words, no chapters, contents, also-built, or running header', () => {
  const words = mainText().split(' ').length;
  assert.ok(words < 500, `${words} words`);
  const d = doc();
  for (const sel of ['section.chapter', 'nav.contents', '.also-built', 'header.running', '.masthead']) assert.equal(d.querySelectorAll(sel).length, 0, sel);
});
test('top nav is exactly Resume, LinkedIn, GitHub, Email', () => {
  const links = doc().querySelectorAll('nav.site a').map(a => [a.text.trim(), a.getAttribute('href')]);
  assert.deepEqual(links, [
    ['Resume', '/resume.pdf'],
    ['LinkedIn', 'https://www.linkedin.com/in/sonichandni/'],
    ['GitHub', 'https://github.com/chandnisoni'],
    ['Email', 'mailto:chandni@thinkmocha.com'],
  ]);
});
test('every claim that has a page links to it', () => {
  const hrefs = doc().querySelectorAll('main a').map(a => a.getAttribute('href'));
  for (const h of ['/work/edgar-miner/', '/work/thinkmocha/', '/work/fundraising-agent/']) assert.ok(hrefs.includes(h), h);
  const access = doc().querySelectorAll('main a').find(a => /ask for access/i.test(a.text));
  assert.ok(access && access.getAttribute('href').startsWith('mailto:chandni@thinkmocha.com'), 'Ask for access is a mailto until Edgar Miner has a URL');
});
test('the beats land in order', () => {
  const t = mainText();
  const beats = [
    'Right now I\'m building Edgar Miner',
    'She cleared her plate.',
    '50+ books',
    'Before that I spent six years as a backend engineer.',
    'Did a bunch of other stuff too.',
    'never got past my friends',
    'Some of it worked. Most of it didn\'t.',
    'Entrepreneurs aren\'t defined by their first 87 ideas.',
    'five languages',
    'P.S.',
  ];
  let pos = 0;
  for (const b of beats) {
    const i = t.indexOf(b, pos);
    assert.ok(i >= pos, `missing or out of order: ${b}`);
    pos = i;
  }
});
test('no status labels or shelved/paused wording anywhere', () => {
  for (const p of allPages()) {
    const d = html(p);
    assert.equal(d.querySelectorAll('.status').length, 0, p);
    assert.doesNotMatch(d.querySelector('body').text, /\((prototype|paused|milestone|shelved)[^)]*\)|never launched|shelved/i, p);
  }
});
test('no eyebrow labels, cards, or icon rows on any page', () => {
  for (const p of allPages()) {
    const d = html(p);
    assert.equal(d.querySelectorAll('[class*="eyebrow"],[class*="card"],[class*="badge"],[class*="icon-row"]').length, 0, p);
    for (const h of d.querySelectorAll('h1,h2,h3')) {
      const prev = h.previousElementSibling;
      if (prev && prev.classList.contains('summary')) continue;
      assert.ok(!prev || !/^(p|span|small|div)$/.test(prev.tagName.toLowerCase()) || prev.text.trim().length > 60, `${p}: label above ${h.text}`);
    }
  }
});
test('colophon carries the build year and the links', () => {
  const c = doc().querySelector('.colophon');
  assert.ok(c.text.includes(String(new Date().getFullYear())));
  assert.ok(c.querySelector('a[href="/resume.pdf"]'));
});
test('nav has no Writing link while there are no published posts', () => {
  assert.equal(doc().querySelectorAll('nav.site a[href^="/writing"]').length, 0);
});
test('intro is left-aligned typographic, not a centered hero', async () => {
  const { readdirSync } = await import('node:fs');
  const { dist, text } = await import('./helpers.mjs');
  const css = readdirSync(dist('_astro')).filter(f => f.endsWith('.css')).map(f => text(`_astro/${f}`)).join('');
  assert.doesNotMatch(css, /\.intro[^}]*text-align:\s*center/);
  assert.doesNotMatch(css, /main[^}]*text-align:\s*center/);
});
