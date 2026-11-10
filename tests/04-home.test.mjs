import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { dist, html, text } from './helpers.mjs';

const doc = () => html('index.html');
const allCss = () => readdirSync(dist('_astro')).filter(f => f.endsWith('.css')).map(f => text(`_astro/${f}`)).join('');

test('five chapter headings with numerals inside the heading, in order', () => {
  const h2 = doc().querySelectorAll('section.chapter h2').map(h => h.text.replace(/\s+/g, ' ').trim());
  assert.deepEqual(h2, ['i. A plate of vegetables', 'ii. Ten thousand restaurants', 'iii. Fifty books', 'iv. Reading between the lines', 'v. The next chapter']);
});
test('no eyebrow labels, cards, or icon rows', () => {
  const d = doc();
  assert.equal(d.querySelectorAll('[class*="eyebrow"],[class*="card"],[class*="badge"],[class*="icon-row"]').length, 0);
  for (const h of d.querySelectorAll('h1,h2,h3')) {
    const prev = h.previousElementSibling;
    assert.ok(!prev || !/^(p|span|small|div)$/.test(prev.tagName.toLowerCase()) || prev.text.trim().length > 60, `label above ${h.text}`);
  }
});
test('table of contents links to all five chapters', () => {
  const hrefs = doc().querySelectorAll('nav.contents a').map(a => a.getAttribute('href'));
  assert.deepEqual(hrefs, ['#i', '#ii', '#iii', '#iv', '#v']);
});
test('contact block has the email, LinkedIn, GitHub, resume', () => {
  const hrefs = doc().querySelectorAll('a').map(a => a.getAttribute('href'));
  for (const h of ['mailto:chandni@thinkmocha.com', 'https://www.linkedin.com/in/sonichandni/', 'https://github.com/chandnisoni', '/resume.pdf']) assert.ok(hrefs.includes(h), h);
});
test('also-built list is a plain list naming MeetAndGreet', () => {
  const li = doc().querySelectorAll('.also-built li').map(l => l.text);
  assert.ok(li.some(t => t.includes('MeetAndGreet') && t.includes('shelved')));
});
test('colophon carries the build year and the five-languages line', () => {
  const c = doc().querySelector('.colophon').text;
  assert.ok(c.includes(String(new Date().getFullYear())) && /five languages/i.test(c));
});
test('masthead is left-aligned typographic, not a centered hero', () => {
  assert.doesNotMatch(allCss(), /\.masthead[^}]*text-align:\s*center/);
});
test('nav has no Writing link while there are no published posts', () => {
  assert.equal(doc().querySelectorAll('nav.site a[href^="/writing"]').length, 0);
});
