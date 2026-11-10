// Builds the site with an extra work entry whose image does not exist in public/.
// Exits with the build's status; the caller asserts it is non-zero.
import { writeFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const file = 'src/content/work/zz-bad.md';
writeFileSync(file, `---
title: Bad fixture
summary: A fixture with a missing image.
status: paused
order: 99
stack: []
media:
  - { src: /images/does-not-exist.webp, alt: x, caption: x, kind: image, width: 10, height: 10 }
---
## The problem
x
`);
let status = 1;
try {
  const r = spawnSync('npx', ['astro', 'build', '--outDir', 'dist-bad'], { encoding: 'utf8' });
  process.stdout.write(r.stdout ?? '');
  process.stderr.write(r.stderr ?? '');
  status = r.status ?? 1;
} finally {
  rmSync(file, { force: true });
  rmSync('dist-bad', { recursive: true, force: true });
}
process.exit(status);
