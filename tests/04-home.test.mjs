import { test } from 'node:test';
import assert from 'node:assert/strict';
import { html, text, allPages } from './helpers.mjs';

const doc = () => html('index.html');
const mainText = () => doc().querySelector('main').text.replace(/\s+/g, ' ').trim();

test('home opens with the product as the headline, its one-line pitch, and no section headings', () => {
  assert.equal(doc().querySelector('main h1').text.trim(), "I'm building Edgar Miner.");
  assert.equal(doc().querySelector('main .purpose').text.replace(/\s+/g, ' ').trim(), 'Point-in-time financials. Company relationships traced to the source.');
  assert.equal(doc().querySelectorAll('main h2').length, 0);
});
test('home meta description names Edgar Miner, not ThinkMocha', () => {
  assert.equal(doc().querySelector('meta[name="description"]').getAttribute('content'), 'Chandni Soni, engineer and founder of Edgar Miner.');
});
test('home is one short column: under 500 words, no chapters, contents, also-built, or running header', () => {
  const words = mainText().split(' ').length;
  assert.ok(words < 500, `${words} words`);
  const d = doc();
  for (const sel of ['section.chapter', 'nav.contents', '.also-built', 'header.running', '.masthead']) assert.equal(d.querySelectorAll(sel).length, 0, sel);
});
test('top nav is exactly LinkedIn, GitHub, Email', () => {
  const links = doc().querySelectorAll('nav.site a').map(a => [a.text.trim(), a.getAttribute('href')]);
  assert.deepEqual(links, [
    ['LinkedIn', 'https://www.linkedin.com/in/sonichandni/'],
    ['GitHub', 'https://github.com/chandnisoni'],
    ['Email', 'mailto:chandni@thinkmocha.com'],
  ]);
});
test('no page links to the resume PDF', () => {
  for (const p of allPages()) assert.doesNotMatch(text(p), /resume\.pdf/i, p);
});
test('every claim that has a page links to it', () => {
  const hrefs = doc().querySelectorAll('main a').map(a => a.getAttribute('href'));
  for (const h of ['/work/edgar-miner/', '/work/talewriter/', '/work/fundraising-agent/']) assert.ok(hrefs.includes(h), h);
  const access = doc().querySelectorAll('main a').find(a => /ask for access/i.test(a.text));
  assert.ok(access && access.getAttribute('href').startsWith('mailto:chandni@thinkmocha.com'), 'Ask for access is a mailto until Edgar Miner has a URL');
  const close = doc().querySelectorAll('main .ps a').find(a => a.text.trim() === 'Email me');
  assert.ok(close && close.getAttribute('href') === 'mailto:chandni@thinkmocha.com', 'the closing line links the email');
  for (const [text, href] of [['Tech MBA', 'https://www.stern.nyu.edu/programs-admissions/tech-mba'], ['Endless Frontier Labs', 'https://endlessfrontierlabs.com/']]) {
    const a = doc().querySelectorAll('main a').find(a => a.text.trim() === text);
    assert.ok(a && a.getAttribute('href') === href, text);
  }
});
test('the TechCrunch and Lifehacker claims link to the Slice Watch articles', () => {
  const links = doc().querySelectorAll('main a');
  const tc = links.find(a => a.text.trim() === 'TechCrunch');
  assert.ok(tc, 'TechCrunch is a link');
  assert.equal(tc.getAttribute('href'), 'https://techcrunch.com/2016/08/23/slices-new-browser-add-on-will-email-you-when-prices-drop/');
  const lh = links.find(a => a.text.trim() === 'Lifehacker');
  assert.ok(lh, 'Lifehacker is a link');
  assert.equal(lh.getAttribute('href'), 'https://lifehacker.com/slice-watch-for-chrome-will-send-you-price-alert-emails-1785669278');
});
test('no page says how many years she spent as an engineer', () => {
  for (const p of allPages()) assert.doesNotMatch(text(p), /six years/i, p);
});
test('the beats land in order', () => {
  const t = mainText();
  const beats = [
    'without later restatements slipping into the picture',
    'Built on SEC filings. Available through API, chat, and MCP.',
    'If you research companies for a living',
    'Before Edgar Miner, I built Talewriter.',
    'she ate the vegetables',
    '50+ personalized books',
    'Before that, I built backend systems.',
    'Chrome extension at Slice',
    'happens outside the code',
    'Endless Frontier Labs',
    'led me to build Fundraising Agent',
    'Some things have worked. Others haven\'t made it very far. Entrepreneurs aren\'t defined by their first 87 ideas.',
    'five languages',
    'If any of this overlaps with what you\'re working on',
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
  assert.deepEqual(c.querySelectorAll('a').map(a => a.text.trim()), ['LinkedIn', 'GitHub']);
  assert.ok(!c.text.includes('@'), 'the footer does not print the address');
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
