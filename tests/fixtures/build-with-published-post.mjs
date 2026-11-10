// Builds the site with one published post and prints what the built HTML shows.
import { writeFileSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { parse } from 'node-html-parser';

const file = 'src/content/writing/zz-fixture.md';
const out = 'dist-fixture';
writeFileSync(file, `---
title: Fixture post
date: ${new Date().toISOString().slice(0, 10)}
summary: A published fixture post.
draft: false
youtube: dQw4w9WgXcQ
---
Body of the fixture post.
`);
let status = 1;
try {
  const r = spawnSync('npx', ['astro', 'build', '--outDir', out], { encoding: 'utf8' });
  if (r.status !== 0) { process.stderr.write(r.stdout + r.stderr); status = r.status ?? 1; }
  else {
  const read = (p) => parse(readFileSync(`${out}/${p}`, 'utf8'));
  const home = read('index.html');
  const index = read('writing/index.html');
  const post = existsSync(`${out}/writing/zz-fixture/index.html`) ? read('writing/zz-fixture/index.html') : parse('');
  const rss = readFileSync(`${out}/rss.xml`, 'utf8');
  process.stdout.write(JSON.stringify({
    navHasWriting: home.querySelectorAll('nav.site a[href^="/writing"]').length > 0,
    indexTitles: index.querySelectorAll('main .post-list a').map((a) => a.text.trim()),
    items: (rss.match(/<item>/g) ?? []).length,
    hasYtButton: !!post.querySelector('button.yt[data-id="dQw4w9WgXcQ"]'),
    iframes: post.querySelectorAll('iframe').length,
  }));
  status = 0;
  }
} finally {
  rmSync(file, { force: true });
  rmSync(out, { recursive: true, force: true });
}
process.exit(status);
