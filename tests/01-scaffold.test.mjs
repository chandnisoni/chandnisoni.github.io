import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, statSync } from 'node:fs';
import { dist, html, text } from './helpers.mjs';

test('build emits CNAME with the domain', () => assert.equal(text('CNAME').trim(), 'chandnisoni.com'));
test('resume is served at both the new and the 2016 path', () => {
  assert.ok(existsSync(dist('resume.pdf')));
  assert.ok(existsSync(dist('ChandniSoni-Resume.pdf')));
  assert.equal(statSync(dist('resume.pdf')).size, statSync(dist('ChandniSoni-Resume.pdf')).size);
});
test('home page exists and has a title and viewport meta', () => {
  const doc = html('index.html');
  assert.ok(doc.querySelector('title')?.text.includes('Chandni Soni'));
  assert.ok(doc.querySelector('meta[name="viewport"]'));
});
