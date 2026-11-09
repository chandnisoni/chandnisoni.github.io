# chandnisoni.com Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 2016 static portfolio with a book-structured Astro site (home as five chapters, three project appendices, a hidden-until-used writing section) deployed to GitHub Pages at chandnisoni.com.

**Architecture:** Astro 7 static site. All copy lives in markdown content collections (`chapters`, `work`, `writing`) so content edits never touch components. Plain CSS with design tokens. Tests run `node --test` against the built `dist/` HTML, which is the only artifact that matters for a static site.

**Tech Stack:** Astro 7, `@astrojs/rss`, `@fontsource-variable/literata`, `@fontsource/source-sans-3`, `node-html-parser` (dev), Node 26 via nvm, GitHub Actions with `withastro/action`.

**Spec:** `docs/superpowers/specs/2026-11-09-site-redesign-design.md`

## Global Constraints

- Work on branch `redesign` in `/Users/chandni/work/chandnisoni.github.io`. Never push to `master` in this plan; merging is Chandni's call (Task 9).
- Node 26 (`source ~/.nvm/nvm.sh && nvm use default`). Astro 7.x. No Tailwind, no component library, no client framework.
- Palette tokens exactly: paper `#F7F2E8`, paper-deep `#EDE5D6`, ink `#1E1A15`, ink-soft `#5B544A`, rule `#D8CEBC`, carrot `#D9622B`. Light only.
- Type: Literata (variable) for display and body, Source Sans 3 for UI labels and footnotes. Self-hosted via fontsource; no request to `fonts.googleapis.com` or `fonts.gstatic.com`.
- Body 18px desktop (`clamp(17px, 1.6vw, 19px)`), measure max 680px prose, images may widen to 900px, line-height 1.55, mobile gutter 20px.
- AI-tells rules (spec §6) are hard rules: no gradients, no cards, no icon rows, no labels above titles, chapter numerals inside the heading, no stock or generated imagery, no JS beyond the running header.
- Banned words (case-insensitive, whole word) in any rendered page: unlock, transform, elevate, empower, leverage, seamless, innovative, passionate, journey. Also banned: the strings "Story Heroes", "StoryHeroes", "paused for the MBA".
- Privacy: the daughter is "my daughter"; no name, no photo, no age beyond "three".
- No image may ship unless its file exists in `public/images/`; figures with missing files must fail the build, not render broken.
- Every metric on the site must appear in the consistency table of `/Users/chandni/work/life/linkedin-updates.md`.
- Commit after every task with the attribution line `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.

## Review Focus

Inputs the spec implies but no task's tests would otherwise exercise, most likely to bite first. Each has a test pinned to the owning task.

1. **Old inbound links.** The 2016 site served `/ChandniSoni-Resume.pdf` and anchors like `/#work`; LinkedIn and old emails still point there. Expected: the old PDF path still returns the current resume. (Task 1 test.)
2. **Zero published posts.** The writing index, RSS feed, and nav must all behave with an empty collection: no nav link, a valid empty feed, an index page that says so plainly. (Task 6 tests.)
3. **A draft post.** A post with `draft: true` must not appear in nav, index, RSS, or as a built page. (Task 6 tests.)
4. **Reduced motion.** A visitor with `prefers-reduced-motion: reduce` must get no fade or transition at all. (Task 7 test.)
5. **A missing image file.** A chapter or work entry referencing an image that is not in `public/images/` must fail `astro build`, so the site never ships a broken figure. (Task 5 test.)

---

## File Structure

```
chandnisoni.github.io/
├── astro.config.mjs                 site URL, markdown (gfm footnotes), integrations
├── package.json                     scripts: dev, build, preview, test
├── tsconfig.json
├── public/
│   ├── CNAME                        "chandnisoni.com"
│   ├── resume.pdf                   current resume (replaced by hand)
│   ├── ChandniSoni-Resume.pdf       copy of resume.pdf, keeps the 2016 URL alive
│   ├── favicon.svg                  a carrot-colored "C" monogram, hand-drawn SVG
│   └── images/                      headshot, screenshots, book spreads (none until Chandni supplies)
├── src/
│   ├── content.config.ts            collections + zod schemas
│   ├── content/
│   │   ├── chapters/{01-vegetables,02-restaurants,03-fifty-books,04-between-the-lines,05-next-chapter}.md
│   │   ├── work/{edgar-miner,fundraising-agent,thinkmocha}.md
│   │   └── writing/hello.md         draft: true fixture; proves hiding works
│   ├── data/site.ts                 name, tagline, email, links, alsoBuilt[]
│   ├── lib/writing.ts               getPublishedPosts()
│   ├── lib/images.ts                assertImageExists(src)
│   ├── layouts/Base.astro           <head>, fonts, Nav, main, Colophon, RunningHeader
│   ├── components/
│   │   ├── Nav.astro                Contents · Work · Writing (conditional) · Say hello
│   │   ├── Masthead.astro           name, tagline, off-axis headshot (optional)
│   │   ├── Contents.astro           table of contents with leaders
│   │   ├── Chapter.astro            h2 with numeral inline, drop cap, optional Figure
│   │   ├── Figure.astro             img with width/height/lazy + caption; asserts file exists
│   │   ├── AlsoBuilt.astro          plain list
│   │   ├── Colophon.astro           one line + build year + contact links
│   │   ├── RunningHeader.astro      current chapter title on scroll (the only JS)
│   │   └── YouTube.astro            click-to-load embed for posts
│   ├── pages/
│   │   ├── index.astro
│   │   ├── work/[slug].astro
│   │   ├── writing/index.astro
│   │   ├── writing/[slug].astro
│   │   ├── rss.xml.ts
│   │   └── 404.astro
│   └── styles/{tokens,base,book}.css
├── tests/
│   ├── helpers.mjs                  dist(), html(path), allPages(), text(path)
│   ├── 01-scaffold.test.mjs
│   ├── 02-styles.test.mjs
│   ├── 04-home.test.mjs
│   ├── 05-work.test.mjs
│   ├── 06-writing.test.mjs
│   ├── 07-perf.test.mjs
│   └── 08-copy.test.mjs
└── .github/workflows/deploy.yml
```

---

### Task 1: Scaffold Astro on the redesign branch, preserve the 2016 site in history

**Files:**
- Create: `astro.config.mjs`, `package.json`, `tsconfig.json`, `src/pages/index.astro` (placeholder, replaced in Task 4), `public/CNAME`, `public/resume.pdf`, `public/ChandniSoni-Resume.pdf`, `tests/helpers.mjs`, `tests/01-scaffold.test.mjs`, `.gitignore`
- Delete: `index.html`, `assets/`, `images/`, `ChandniSoni-Resume.pdf`, `LICENSE.txt` (root copies; moved into `public/` where kept)
- Modify: `README.md`

**Interfaces:**
- Produces: `tests/helpers.mjs` exporting `dist(rel: string): string` (absolute path under `dist/`), `html(rel: string): HTMLElement` (parsed with `node-html-parser`, `rel` like `index.html`), `allPages(): string[]` (every `*.html` under `dist/`, relative), `text(rel: string): string` (file contents). `package.json` script `test` = `astro build && node --test tests/`.

- [ ] **Step 1: Tag the old site**

```bash
git tag v1-2016 master && git push origin v1-2016
```
Expected: tag visible in `git tag`.

- [ ] **Step 2: Write the failing scaffold test** in `tests/01-scaffold.test.mjs`

```js
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
```

- [ ] **Step 3: Run it to verify it fails**

Run: `source ~/.nvm/nvm.sh && nvm use default && node --test tests/`
Expected: FAIL, `dist/` does not exist.

- [ ] **Step 4: Scaffold Astro** with `npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict`, then `npm i astro@^7 @astrojs/rss @fontsource-variable/literata @fontsource/source-sans-3` and `npm i -D node-html-parser`. Set `site: 'https://chandnisoni.com'` and `markdown: { gfm: true }` in `astro.config.mjs`. Add scripts `dev`, `build`, `preview`, `test`. `.gitignore`: `node_modules/`, `dist/`, `.astro/`.

- [ ] **Step 5: Move static files.** `public/CNAME` from root `CNAME`. Copy `/Users/chandni/work/life/ChandniSoni-resume-2026-founder.pdf` to `public/resume.pdf` and `public/ChandniSoni-Resume.pdf` (Chandni replaces both with a Word export later; note this in README). `git rm` the 2016 `index.html`, `assets/`, `images/`, root PDF. Placeholder `src/pages/index.astro` renders `<title>Chandni Soni</title>` and the viewport meta.

- [ ] **Step 6: Write `tests/helpers.mjs`** with the four exports in Interfaces, using `node:fs`, `node:path`, `node-html-parser`'s `parse`.

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test`
Expected: 3 passing.

- [ ] **Step 8: Update README** to: what the site is, `npm run dev`, how to add a post (one markdown file in `src/content/writing/`), how to replace the resume (export PDF from the docx to both paths in `public/`), and the Pages source setting (Task 9).

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat: scaffold Astro site, preserve 2016 site as tag v1-2016"
```

---

### Task 2: Design tokens, typography, base layout, 404

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/book.css` (empty shell, filled in Task 4), `src/layouts/Base.astro`, `src/pages/404.astro`, `public/favicon.svg`, `tests/02-styles.test.mjs`
- Modify: `src/pages/index.astro` to use `Base`

**Interfaces:**
- Produces: `Base.astro` with props `{ title: string; description: string; currentChapterTitles?: string[] }` rendering `<html lang="en">`, `<head>` (title as `${title} · Chandni Soni` except on home where it is `Chandni Soni`), the three stylesheets, fontsource imports, a `<slot />` inside `<main>`, and slots `nav` and `colophon` for Tasks 4 and 6. CSS custom properties `--paper --paper-deep --ink --ink-soft --rule --carrot --font-serif --font-sans --measure --gutter`.

- [ ] **Step 1: Write the failing style tests** in `tests/02-styles.test.mjs`

```js
test('no Google Fonts requests; fonts are self-hosted', () => {
  for (const p of allPages()) assert.doesNotMatch(text(p), /fonts\.(googleapis|gstatic)\.com/);
  assert.ok(readdirSync(dist('_astro')).some(f => /literata.*\.woff2$/i.test(f)));
});
test('no gradients anywhere in shipped CSS', () => {
  for (const f of readdirSync(dist('_astro')).filter(f => f.endsWith('.css')))
    assert.doesNotMatch(text(`_astro/${f}`), /gradient\(/);
});
test('tokens are the spec values', () => {
  const css = readdirSync(dist('_astro')).filter(f => f.endsWith('.css')).map(f => text(`_astro/${f}`)).join('');
  for (const v of ['#F7F2E8','#EDE5D6','#1E1A15','#5B544A','#D8CEBC','#D9622B']) assert.ok(css.toUpperCase().includes(v), v);
});
test('404 page exists and links home', () => assert.ok(html('404.html').querySelector('a[href="/"]')));
```

- [ ] **Step 2: Run to verify fail** — `npm test`, expected FAIL on `_astro` missing or tokens absent.

- [ ] **Step 3: Write `tokens.css`** with the six colors, `--font-serif: 'Literata Variable', Georgia, serif`, `--font-sans: 'Source Sans 3', system-ui, sans-serif`, `--measure: 680px`, `--measure-wide: 900px`, `--gutter: 20px`, `--leading: 1.55`.

- [ ] **Step 4: Write `base.css`:** `body` background paper, color ink, serif, `font-size: clamp(17px, 1.6vw, 19px)`, line-height 1.55, `font-variant-numeric: oldstyle-nums`; `main { max-width: var(--measure); margin-inline: auto; padding-inline: var(--gutter) }`; links carrot with underline offset; `h1,h2` serif, normal weight, no uppercase; `.sans` for UI; footnotes (`.footnotes`) in sans at 0.85em with a top hairline in `--rule`; `img { max-width: 100%; height: auto; display: block }`. No transitions here (Task 7 owns motion).

- [ ] **Step 5: Write `Base.astro`** per Interfaces, importing `@fontsource-variable/literata` and `@fontsource/source-sans-3/400.css` and `/600.css`, and the three CSS files. `404.astro`: "This page isn't in the book." plus a link to `/`. `favicon.svg`: a single-path carrot-colored "C", 32×32, no gradients.

- [ ] **Step 6: Run tests to verify pass** — `npm test`, expected 7 passing.

- [ ] **Step 7: Commit** — `git commit -m "feat: design tokens, typography, base layout, 404"`

---

### Task 3: Content collections and copy

**Files:**
- Create: `src/content.config.ts`, `src/data/site.ts`, `src/content/chapters/*.md` (5), `src/content/work/*.md` (3), `src/content/writing/hello.md`, `src/lib/images.ts`

**Interfaces:**
- Produces: collections `chapters` (frontmatter `numeral: 'i'|'ii'|'iii'|'iv'|'v'`, `title`, `subtitle`, `order: number`, `image?: { src, alt, caption }`, `appendices?: string[]` slugs), `work` (`title`, `summary`, `status: 'prototype, in progress' | 'milestone 1 complete' | 'paused'`, `stack: string[]`, `order`, `media?: { src, alt, caption, kind: 'image'|'video' }[]`), `writing` (`title`, `date: Date`, `summary`, `draft: boolean` default false, `youtube?: string`). `site.ts` exports `site = { name, tagline, email: 'chandni@thinkmocha.com', links: { linkedin, github, resume: '/resume.pdf', calendar: null }, alsoBuilt: [{ name, year, status, line }] }`. `assertImageExists(src: string): void` throws if `public${src}` is missing.

- [ ] **Step 1: Write `content.config.ts`** with `defineCollection` + `glob` loaders and the zod schemas above. `date` via `z.coerce.date()`.

- [ ] **Step 2: Write the five chapters.** Frontmatter per Interfaces; `order` 1–5; `image` omitted until assets arrive (never a placeholder path). Body copy, first person, with GFM footnotes for stack detail. Use this copy verbatim, edited only for facts that change:

**01 · i · A plate of vegetables · how it started**
My daughter was three and would not eat vegetables. One night, instead of negotiating, I made her a storybook. I used AI to write it and draw it. She was the hero, and the vegetables were part of the adventure. She cleared her plate. I made books for friends' children next. Parents kept asking for the same two things: a character who looked like their kid, and a story from their own culture. No bookstore had either. That was the moment personalized books stopped being a trick and became a product.

**02 · ii · Ten thousand restaurants · the engineer years**
Before any of that, I spent six years as a backend engineer, most of them at Rakuten in New York. I led the backend for Rakuten Dining, which brought more than ten thousand U.S. restaurants into the rewards program and opened a new line of revenue.[^1] I also ran a proof of concept that moved one service to serverless and cut its infrastructure cost by 90 percent. I showed the numbers to the executives, the company adopted the approach everywhere, and overall infrastructure costs fell by 80 percent. At Serverless Inc. I rebuilt billing on Stripe. Processing got 98 percent faster and errors fell by 95 percent.[^2]
[^1]: Node.js, Express, Redis, Postgres, AWS. One API served both the iOS and Android apps.
[^2]: Node.js, TypeScript, DynamoDB, AWS Lambda, Stripe API.

**03 · iii · Fifty books · ThinkMocha**
ThinkMocha LLC is my company. I started it in 2022, and its first product was the storybook platform. I built all of it alone: the research with parents and teachers, the product, and the pipeline that writes a story and illustrates it.[^3] A preschool in Manhattan ran a pilot with us. We delivered more than fifty books, and more than nine in ten of the educators and parents said they liked them. Then I went to NYU Stern for the Tech MBA, to learn the parts of company-building I did not have yet. While there I sat on the screening committee at Endless Frontier Labs, reading deep-tech startups the way I now read filings.
[^3]: Next.js, Express, and generative models for text and illustration.
`appendices: [thinkmocha]`

**04 · iv · Reading between the lines · now**
Now I am building ThinkMocha's second product. Edgar Miner reads every SEC filing so you don't have to. It turns filings into structured data and maps the relationships between companies, for people who do investment research. It is a prototype, and it is in progress: it ingests the SEC's archive back to 1995 and is learning to answer questions about who is connected to whom.[^4] Earlier this year I also built Fundraising Agent, which runs a founder's investor outreach with a human approving every send.
[^4]: Django, Postgres, Dagster pipelines, XBRL extraction, and a graph layer.
`appendices: [edgar-miner, fundraising-agent]`

**05 · v · The next chapter · what I'm looking for**
I have built alone twice. The next company gets built with people. I am looking for the kind who would rather ship a rough version to ten users this week than a polished one to nobody next quarter, who can argue with me and then commit, and who care that the thing works for the person using it. If you are an investor, or you do research for a living, start with Appendix A. If you want to build with me, write to me. If you need the formal version, the resume is below.

- [ ] **Step 3: Write the three work entries** from spec §5, each with sections `## The problem`, `## What I built`, `## How it's built`, `## Where it is`, in that order, and `media: []` until assets arrive. Status values exactly: edgar-miner `prototype, in progress`; fundraising-agent `milestone 1 complete`; thinkmocha `paused`. Use "reads every SEC filing so you don't have to" as edgar-miner's `summary`.

- [ ] **Step 4: Write `writing/hello.md`** with `draft: true`, title "Hello", today's date, one sentence body. **Write `site.ts`** with `alsoBuilt: [{ name: 'MeetAndGreet', year: 2023, status: 'shelved', line: 'An events platform for meeting people around shared plans. 260 commits, never launched.' }]`. **Write `lib/images.ts`** with `assertImageExists`.

- [ ] **Step 5: Verify the build accepts the content** — `npm run build`, expected: no schema errors. (Rendering is tested in Tasks 4–6.)

- [ ] **Step 6: Commit** — `git commit -m "feat: content collections, chapter and appendix copy"`

---

### Task 4: Home page as a book

**Files:**
- Create: `src/components/{Nav,Masthead,Contents,Chapter,Figure,AlsoBuilt,Colophon}.astro`, `tests/04-home.test.mjs`
- Modify: `src/pages/index.astro`, `src/styles/book.css`, `src/layouts/Base.astro` (wire Nav and Colophon)

**Interfaces:**
- Consumes: collections and `site` from Task 3; `Base` from Task 2.
- Produces: `Chapter.astro` props `{ entry: CollectionEntry<'chapters'> }` rendering `<section class="chapter" id={numeral}><h2><span class="numeral">{numeral}.</span> {title}</h2>…`; `Figure.astro` props `{ src, alt, caption, width, height }` calling `assertImageExists(src)` at build; `Nav.astro` props `{ showWriting: boolean }`; `Colophon.astro` no props, renders the year via `new Date().getFullYear()` at build.

- [ ] **Step 1: Write the failing home tests** in `tests/04-home.test.mjs`

```js
const doc = () => html('index.html');
test('five chapter headings with numerals inside the heading, in order', () => {
  const h2 = doc().querySelectorAll('section.chapter h2').map(h => h.text.replace(/\s+/g,' ').trim());
  assert.deepEqual(h2, ['i. A plate of vegetables','ii. Ten thousand restaurants','iii. Fifty books','iv. Reading between the lines','v. The next chapter']);
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
  assert.deepEqual(hrefs, ['#i','#ii','#iii','#iv','#v']);
});
test('contact block has the email, LinkedIn, GitHub, resume', () => {
  const hrefs = doc().querySelectorAll('a').map(a => a.getAttribute('href'));
  for (const h of ['mailto:chandni@thinkmocha.com','https://www.linkedin.com/in/sonichandni/','https://github.com/chandnisoni','/resume.pdf']) assert.ok(hrefs.includes(h), h);
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
  const css = readdirSync(dist('_astro')).filter(f => f.endsWith('.css')).map(f => text(`_astro/${f}`)).join('');
  assert.doesNotMatch(css, /\.masthead[^}]*text-align:\s*center/);
});
test('nav has no Writing link while there are no published posts', () => {
  assert.equal(doc().querySelectorAll('nav.site a[href^="/writing"]').length, 0);
});
```

- [ ] **Step 2: Run to verify fail** — `npm test`, expected FAIL on missing `section.chapter`.

- [ ] **Step 3: Implement components.** `Masthead`: `<header class="masthead">` with `<h1>` name, `<p class="tagline">` from `site.tagline` ("Engineer and founder. I build things that turn messy documents into stories people can act on."), optional `Figure` headshot only if `site.headshot` is set. `Contents`: `<nav class="contents" aria-label="Contents"><ol>` with `<a href="#numeral">` and the subtitle after a dotted leader (CSS `::after` with `border-bottom: 1px dotted var(--rule)`). `Chapter`: as in Interfaces, body via `render(entry)`, drop cap via `.chapter > p:first-of-type::first-letter`, appendices rendered as `<p class="see-also">` links "Appendix A →" mapped from slugs (`edgar-miner`→A, `fundraising-agent`→B, `thinkmocha`→C). `AlsoBuilt`: `<section class="also-built"><h2>Also built</h2><ul>`. `Colophon`: `<footer class="colophon">` with the line "Set in Literata. Built with Astro, hosted on GitHub Pages, written by me. I speak five languages, if you want to start a conversation in one of them." plus contact links from `site.links` and `mailto:`, then `© {year} Chandni Soni`. `Nav`: `<nav class="site sans">` with Contents (`/#contents`), Work (`/work/edgar-miner`), Writing (`/writing/`, only if `showWriting`), Say hello (`/#v`).

- [ ] **Step 4: `index.astro`:** load chapters sorted by `order`, `getPublishedPosts()` is Task 6, so for now pass `showWriting={false}`; compose Masthead, Contents, five Chapters, AlsoBuilt, Colophon inside `Base`.

- [ ] **Step 5: `book.css`:** masthead left-aligned with the h1 at `clamp(2.4rem, 6vw, 4rem)`; `.numeral` in carrot, same font and size as the heading; contents leaders; `.chapter` margin-block 3rem; `.see-also` in sans; margin notes as `aside.note` floated into the right margin above 1100px and inline below; hairline rules only via `--rule`.

- [ ] **Step 6: Run tests to verify pass** — `npm test`, expected all passing.

- [ ] **Step 7: Visual check in Chrome:** `npm run dev`, open `http://localhost:4321/` at 1280px and 375px wide, screenshot both. Confirm: no horizontal scroll at 375px, numerals inline with titles, TOC leaders render, drop caps present. Fix CSS until true.

- [ ] **Step 8: Commit** — `git commit -m "feat: home page as a book — masthead, contents, chapters, colophon"`

---

### Task 5: Project pages (appendices)

**Files:**
- Create: `src/pages/work/[slug].astro`, `src/components/Media.astro`, `tests/05-work.test.mjs`
- Modify: `src/styles/book.css`

**Interfaces:**
- Consumes: `work` collection, `Base`, `Figure`, `assertImageExists`.
- Produces: pages at `/work/<slug>/index.html` with `<h1>{title} <span class="status">({status})</span></h1>`, a `<p class="summary">`, the four `h2` sections from the markdown in order, `<figure>` media, and `<a class="back" href="/#iv">Back to the book</a>`. `Media.astro` props `{ items: Media[] }` renders `Figure` for images and a muted, looping, `playsinline`, `preload="metadata"` `<video>` for `kind: 'video'`.

- [ ] **Step 1: Write the failing work tests**

```js
const pages = ['work/edgar-miner/index.html','work/fundraising-agent/index.html','work/thinkmocha/index.html'];
test('three appendix pages exist with inline status in the h1', () => {
  const want = { 'edgar-miner': '(prototype, in progress)', 'fundraising-agent': '(milestone 1 complete)', 'thinkmocha': '(paused)' };
  for (const p of pages) { const h1 = html(p).querySelector('h1').text.replace(/\s+/g,' '); assert.ok(h1.endsWith(want[p.split('/')[1]]), h1); }
});
test('sections appear in the spec order', () => {
  for (const p of pages) assert.deepEqual(html(p).querySelectorAll('main h2').map(h => h.text.trim()), ['The problem','What I built',"How it's built",'Where it is']);
});
test('edgar miner leads with the one-liner', () => assert.ok(html(pages[0]).querySelector('.summary').text.includes("reads every SEC filing so you don't have to")));
test('every image on every page resolves to a shipped file', () => {
  for (const p of allPages()) for (const img of html(p).querySelectorAll('img')) {
    const src = img.getAttribute('src'); assert.ok(src && existsSync(dist(src.replace(/^\//,''))), `${p}: ${src}`);
  }
});
test('a work entry pointing at a missing image fails the build', async () => {
  // run astro build with an injected bad entry in a temp copy of the content dir
  const r = spawnSync('node', ['tests/fixtures/build-with-bad-image.mjs'], { encoding: 'utf8' });
  assert.notEqual(r.status, 0); assert.match(r.stderr + r.stdout, /Missing image: \/images\/does-not-exist\.webp/);
});
```
Write `tests/fixtures/build-with-bad-image.mjs`: copies `src/content/work/thinkmocha.md` to `src/content/work/zz-bad.md` with `media: [{ src: '/images/does-not-exist.webp', alt: 'x', caption: 'x', kind: 'image' }]`, runs `npx astro build --outDir dist-bad`, deletes the fixture file and `dist-bad` in a `finally`, exits with the build's status.

- [ ] **Step 2: Run to verify fail** — `npm test`, expected FAIL, no `work/` pages.

- [ ] **Step 3: Implement `[slug].astro`** with `getStaticPaths` over `work`, `Media.astro`, and `Figure` calling `assertImageExists(src)` which throws `new Error(\`Missing image: ${src}\`)`.

- [ ] **Step 4: Run tests to verify pass** — `npm test`.

- [ ] **Step 5: Commit** — `git commit -m "feat: project appendix pages with inline status and media"`

---

### Task 6: Writing section, RSS, conditional nav, YouTube embed

**Files:**
- Create: `src/lib/writing.ts`, `src/pages/writing/index.astro`, `src/pages/writing/[slug].astro`, `src/pages/rss.xml.ts`, `src/components/YouTube.astro`, `tests/06-writing.test.mjs`, `tests/fixtures/build-with-published-post.mjs`
- Modify: `src/pages/index.astro` and `src/layouts/Base.astro` (`showWriting` from `getPublishedPosts().length > 0`)

**Interfaces:**
- Consumes: `writing` collection, `Nav`.
- Produces: `getPublishedPosts(): Promise<CollectionEntry<'writing'>[]>` filtering `draft !== true`, sorted by `date` descending. `YouTube.astro` props `{ id: string; title: string }` rendering a `<button class="yt" data-id>` with the poster image from `https://i.ytimg.com/vi/{id}/hqdefault.jpg` and a 10-line inline script that swaps in the iframe on click.

- [ ] **Step 1: Write the failing writing tests**

```js
test('with only a draft post: no nav link, index says so, draft page not built, feed valid and empty', () => {
  assert.equal(html('index.html').querySelectorAll('nav.site a[href^="/writing"]').length, 0);
  assert.match(html('writing/index.html').querySelector('main').text, /Nothing here yet/);
  assert.ok(!existsSync(dist('writing/hello/index.html')));
  const xml = text('rss.xml'); assert.match(xml, /<rss/); assert.doesNotMatch(xml, /<item>/);
});
test('with one published post: nav shows Writing, index lists it, feed has one item, page has the YouTube button', () => {
  const r = spawnSync('node', ['tests/fixtures/build-with-published-post.mjs'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const out = JSON.parse(r.stdout); // { navHasWriting, indexTitles, items, hasYtButton, iframes }
  assert.equal(out.navHasWriting, true); assert.deepEqual(out.indexTitles, ['Fixture post']);
  assert.equal(out.items, 1); assert.equal(out.hasYtButton, true); assert.equal(out.iframes, 0);
});
```
The fixture script writes `src/content/writing/zz-fixture.md` (`draft: false`, `youtube: dQw4w9WgXcQ`, date today), builds to `dist-fixture`, reads the three facts with `node-html-parser`, prints JSON, and removes the fixture and `dist-fixture` in `finally`.

- [ ] **Step 2: Run to verify fail** — `npm test`.

- [ ] **Step 3: Implement** `writing.ts`, `writing/index.astro` (list of title, date, summary; "Nothing here yet." when empty), `writing/[slug].astro` (`getStaticPaths` over published posts only; renders `YouTube` when `youtube` is set), `rss.xml.ts` with `@astrojs/rss` over published posts, `YouTube.astro`. Wire `showWriting` in `index.astro` and any page using `Base`.

- [ ] **Step 4: Run tests to verify pass** — `npm test`.

- [ ] **Step 5: Commit** — `git commit -m "feat: writing section hidden until first post, RSS, click-to-load YouTube"`

---

### Task 7: Running header, motion rules, performance budget

**Files:**
- Create: `src/components/RunningHeader.astro`, `tests/07-perf.test.mjs`
- Modify: `src/layouts/Base.astro`, `src/styles/book.css`, `src/components/Figure.astro`

**Interfaces:**
- Produces: `RunningHeader.astro` rendering `<header class="running sans" aria-hidden="true"><span data-running></span></header>` and one inline `<script>` using `IntersectionObserver` over `section.chapter` to set the span's text to the current chapter's `h2` text. The only `<script>` on the home page besides Astro's none. `Figure` emits `loading="lazy" decoding="async"` and explicit `width`/`height` from props.

- [ ] **Step 1: Write the failing perf tests**

```js
test('home has at most one script, and it is the running header', () => {
  const s = html('index.html').querySelectorAll('script'); assert.ok(s.length <= 1);
  if (s.length) assert.match(s[0].text, /IntersectionObserver/);
});
test('appendix pages ship zero scripts', () => { for (const p of ['work/edgar-miner/index.html']) assert.equal(html(p).querySelectorAll('script').length, 0); });
test('images are lazy, async, and sized', () => {
  for (const p of allPages()) for (const img of html(p).querySelectorAll('img')) {
    assert.equal(img.getAttribute('loading'), 'lazy'); assert.ok(img.getAttribute('width') && img.getAttribute('height'), p);
  }
});
test('reduced motion disables all transitions and animations', () => {
  const css = readdirSync(dist('_astro')).filter(f => f.endsWith('.css')).map(f => text(`_astro/${f}`)).join('');
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[^}]*\{[^}]*(animation|transition)[^}]*none/s);
});
test('fonts use font-display swap', () => {
  const css = readdirSync(dist('_astro')).filter(f => f.endsWith('.css')).map(f => text(`_astro/${f}`)).join('');
  assert.match(css, /font-display:\s*swap/);
});
```

- [ ] **Step 2: Run to verify fail.**

- [ ] **Step 3: Implement.** Running header fixed at top, paper background, hairline bottom, hidden until scrolled past the masthead (toggle `.visible` class). The only motion in the site: `.chapter img { opacity: 0; transition: opacity .4s }` → `.loaded`; wrapped so `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important } }` and images render at full opacity. Fontsource CSS already sets `font-display: swap`; if not, add `@font-face` overrides.

- [ ] **Step 4: Run tests to verify pass.**

- [ ] **Step 5: Lighthouse** — `npm run build && npx serve dist -l 4321 &` then `npx lighthouse http://localhost:4321/ --preset=desktop --quiet --chrome-flags="--headless" --output=json --output-path=/tmp/lh-home.json` and the same for `/work/edgar-miner/` and with `--form-factor=mobile`. Expected: `categories.*.score` all `1`. Fix until true.

- [ ] **Step 6: Commit** — `git commit -m "feat: running header, reduced-motion rules, performance budget"`

---

### Task 8: Copy guards (banned words, privacy, consistency)

**Files:**
- Create: `tests/08-copy.test.mjs`

**Interfaces:**
- Consumes: all built pages.

- [ ] **Step 1: Write the tests** (these should pass on the first run if Tasks 3–6 followed the copy; if any fail, fix the content, not the test)

```js
const BANNED = ['unlock','transform','elevate','empower','leverage','seamless','innovative','passionate','journey'];
test('no banned words on any page', () => {
  for (const p of allPages()) { const t = html(p).querySelector('body').text.toLowerCase();
    for (const w of BANNED) assert.doesNotMatch(t, new RegExp(`\\b${w}\\b`), `${p}: ${w}`); }
});
test('no competitor name, no "paused for the MBA"', () => {
  for (const p of allPages()) { const t = html(p).querySelector('body').text; assert.doesNotMatch(t, /story\s?heroes|paused for the MBA/i, p); }
});
test('daughter is anonymous', () => {
  const t = html('index.html').querySelector('body').text;
  assert.match(t, /my daughter/i); assert.doesNotMatch(t, /my daughter,?\s+[A-Z][a-z]+/, 'a name follows "my daughter"');
});
test('metrics on the site all appear in the LinkedIn consistency table', () => {
  const table = readFileSync('/Users/chandni/work/life/linkedin-updates.md','utf8');
  const site = allPages().map(p => html(p).querySelector('body').text).join(' ');
  for (const m of ['50+','90%','98%','95%','10,000+','80%','20 hours','2 hours']) if (site.includes(m)) assert.ok(table.includes(m.replace(' hours','')), m);
});
```
Note: chapter copy spells numbers in prose ("more than fifty books", "ten thousand"). The metrics test therefore checks appendix pages, which use the numerals. Keep numerals on appendix pages so the cross-check has teeth.

- [ ] **Step 2: Run** — `npm test`, expected pass; fix content if not.

- [ ] **Step 3: Commit** — `git commit -m "test: copy guards for banned words, privacy, metric consistency"`

---

### Task 9: Deploy workflow and handoff

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

**Interfaces:**
- Produces: a workflow on `push` to `master` and `workflow_dispatch`, jobs `build` (checkout, `withastro/action@v4` with `node-version: 26`) and `deploy` (`actions/deploy-pages@v4`), permissions `contents: read, pages: write, id-token: write`.

- [ ] **Step 1: Write the workflow** per Interfaces.

- [ ] **Step 2: Validate it** — `npx action-validator .github/workflows/deploy.yml` (or `python3 -c "import yaml,sys;yaml.safe_load(open('.github/workflows/deploy.yml'))"`), expected: no errors.

- [ ] **Step 3: Full test run** — `npm test`, expected all passing. `git status` clean.

- [ ] **Step 4: Push the branch** — `git push -u origin redesign`. Do **not** merge.

- [ ] **Step 5: Write the handoff in README** under "Launching": (a) in repo Settings → Pages set Source to "GitHub Actions"; (b) merge `redesign` into `master`; (c) the Actions run deploys; (d) Cloudflare needs no change; (e) before merging, drop the assets from spec §9 into `public/images/` and set `image`/`media` frontmatter, export the resume PDF from Word to both `public/` paths, run `npm test`.

- [ ] **Step 6: Commit and push** — `git commit -m "ci: GitHub Pages deploy workflow; launch checklist"` then `git push`.

- [ ] **Step 7: Hand off** — invoke `superpowers:finishing-a-development-branch`. The merge to `master` is Chandni's decision because it replaces the live site.

---

## Self-review notes

- Spec §4 masthead photo, §9 assets: covered by `Figure` + optional `site.headshot`; the site builds with no images and ships none until files exist (Global Constraints).
- Spec §3 `/rss.xml`: Task 6. Spec §8 `v1-2016` tag: Task 1. Spec §6 running header, drop caps, oldstyle numerals: Tasks 2, 4, 7. Spec §11 Lighthouse: Task 7 step 5. Spec §11 swap test: a human review step at handoff; not automatable.
- Spec §9a (three surfaces): the metrics cross-check in Task 8 is the only automatable part; the rest is the launch checklist.
- Types: `status` union in Task 3 matches the h1 assertions in Task 5; `numeral` values match the TOC hrefs in Task 4; `getPublishedPosts` name used in Tasks 4 and 6.
