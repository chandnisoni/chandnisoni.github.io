# chandnisoni.com redesign — design spec

**Date:** 2026-11-09
**Owner:** Chandni Soni
**Status:** draft for review

## 1. Purpose

Replace the 2016 "Full Stack Engineer" portfolio with a site whose job is to make a founder, early hire, or client want to work with Chandni. The site tells one story, in her voice, that ends in "founder" as the obvious next chapter. It must read as made by a person, not generated.

Readers, in priority order: potential cofounders and early hires; YC and accelerator reviewers who click through from an application; prospective clients and collaborators; recruiters, incidentally.

## 2. Theme and persona

**Theme: The Storyteller.** Chandni makes stories for people who couldn't read them before. Her daughter got a book where she was the hero. ThinkMocha gave families books with children who looked like theirs. Edgar Miner reads thousands of SEC filings and tells an investor the story of a company's relationships. Fundraising Agent tells an investor a founder's story. Being a founder is writing the next chapter.

**Persona:** the engineer who tells stories. Warm, builds alone when needed, listens to the reader, ships.

**Metaphor, applied literally:** the site is a short book. The home page is its table of contents and chapters. Project pages are appendices. Posts are later chapters. Running header, chapter numerals set in the heading itself, drop caps, margin notes, footnotes for technical detail.

**Voice:** warm and plain. First person. Short sentences. No jargon on the home page; stack details go in footnotes or project pages. A little humor. Never a product-page register ("leverage", "empower", "seamless").

## 3. Information architecture

```
chandnisoni.com/
├── /                         the book: contents + five chapters + colophon
├── /work/edgar-miner         appendix A
├── /work/fundraising-agent   appendix B
├── /work/thinkmocha          appendix C
├── /writing/                 later chapters (index; absent from nav until a post exists)
│   └── /writing/<slug>
├── /resume.pdf               current PDF, replaced by hand
└── /rss.xml                  feed for /writing
```

Navigation: **Contents** (anchors on home), **Work**, **Writing** (only when posts exist), **Say hello**. No separate About page; the home page is the about page.

## 4. Home page, chapter by chapter

Each chapter is a short section: numeral, title, 60–150 words, at most one image. Readers should finish the page in under three minutes.

**Masthead.** Name set large in the serif. One line beneath: *Engineer and founder. I build things that turn messy documents into stories people can act on.* Headshot, small, not centered, with a one-line caption in Chandni's words.

**Contents.** A real table of contents listing the five chapters with page-style leaders. Anchors scroll.

**i. A plate of vegetables** (how it started). The origin, told straight: a three-year-old who wouldn't eat vegetables, a storybook made with AI where she was the hero, a cleared plate. Then books for friends' children, and parents asking for characters who looked like their kids and stories from their own cultures. Image: one ThinkMocha illustration or book spread (see §7 privacy).

**ii. Ten thousand restaurants** (the engineer years). Six years of backend at Rakuten and Serverless: Rakuten Dining and its 10,000+ restaurants, the serverless proof of concept that became company-wide adoption and cut infrastructure costs 80%, billing rebuilt on Stripe at Serverless (98% faster, 95% fewer errors). Footnotes carry the stack. No image, or a single small artifact (a TechCrunch clipping for Slice Watch).

**iii. Fifty books** (ThinkMocha). Built alone: research, product, generative pipeline. Pilot at a Manhattan preschool, 50+ books, 90%+ positive feedback. Honest close: "Then I went to Stern for the Tech MBA, to learn the parts of company-building I didn't have yet." One sentence on EFL screening committee. Link to appendix C.

**iv. Reading between the lines** (now). Edgar Miner: SEC filings turned into structured data and a graph of company relationships for investment research. What it does today, honestly labeled *prototype, in progress*. One screenshot. Mention Fundraising Agent in one sentence as the other thing built this year. Link to appendices A and B.

**v. The next chapter** (what I'm looking for). The founder statement without naming a market: the next company gets built with people, not alone; what kind of people; an invitation. Contact block: email (chandni@thinkmocha.com), LinkedIn, GitHub, calendar link (placeholder until provided), resume PDF.

**Colophon.** One line: how the site is built, that the words are hers, and that she speaks five languages (the conversation starter). Copyright with the current year, generated at build.

**Also built.** A short list under the colophon or inside chapter iv: MeetAndGreet (events platform, 2023, shelved). One line, status tag, no link. Room for more lines later.

## 5. Project pages (appendices)

Same template for all three:

1. Title and one-line summary; status tag (*prototype*, *M1 complete*, *paused*).
2. **The problem**, two to four sentences, in the reader's terms.
3. **What I built**, prose plus a short list of capabilities.
4. **How it's built**, stack and architecture in a footnote-style block.
5. **Where it is**, current status and what's next, honest.
6. Media: screenshots with captions; a short screen recording (muted, looping, under 90 seconds) where available.
7. Back to the book.

Content for each:

- **Edgar Miner.** Django, Postgres, Dagster pipelines backfilling the SEC feed archive from 1995, XBRL extraction, relationship graph, alerts, chat. Private repo; the page is the public face. Status: prototype, in progress.
- **Fundraising Agent.** Raise mode and update mode; fit-matching, drafting, send-on-approval, follow-ups, warm-investor updates; target of 20 hours a week to under 2. n8n Cloud workflows, Next.js front end, Google Sheets as the system of record, Anthropic for reasoning. Status: milestone 1 complete (April 2026).
- **ThinkMocha.** Next.js, Express, generative pipeline for story and illustrations. 50+ books, Manhattan preschool pilot, 90%+ positive feedback. Status: paused.

## 6. Visual system

**Rules that keep it human:**

- No centered hero over a gradient. The masthead is left-aligned, typographic, with the photo off-axis.
- No grid of identical cards with icons. Chapters are prose with occasional images.
- No purple-to-blue, no glass effects, no emoji, no stock illustration, no generic icon set.
- Real artifacts only: her photo, her book pages, her screenshots, her words.
- Asymmetry and white space over symmetry and density.
- Imperfection is allowed: a margin note, a crossed-out line, a caption in her words.

**AI-tells checklist (Chandni's list, each one a hard rule):**

| tell | rule for this site |
|---|---|
| Purple-to-blue glowing gradients | No gradients anywhere. Flat paper, flat ink, one flat accent. |
| "Card hell" and icon rows | No cards, no icon rows, no badges. Chapters are prose. The "Also built" list is a plain list. |
| Text eyebrows (small mono labels floating above titles) | Chapter numerals are set *inside* the heading in the serif, book-style ("iii. Fifty books"), never as a small label above it. No category labels above any title anywhere. Status tags on project pages sit inline after the title, in the same serif, in parentheses. |
| Generic AI imagery | Only photographs Chandni took or appears in, her own screenshots, and ThinkMocha book pages. No generated people, no stock photos, no decorative illustration. The early face-swap experiments in the ThinkMocha archive are banned. |
| Purposeless whitespace | Every margin has a job: book margins carry margin notes, captions, or footnote numbers. If a gap has nothing in it, the measure shrinks instead. |
| Vague buzzwords | Every headline and caption names a concrete thing: a plate of vegetables, ten thousand restaurants, fifty books. Banned words: unlock, transform, elevate, empower, leverage, seamless, innovative, passionate, journey. |
| No real-world presence | Place names and specifics throughout: New York, the kitchen table, a Manhattan preschool, Stern, the SEC feed archive back to 1995. A real photo of her and of where she works. |
| Interchangeable branding | The swap test (§11): replace the name and photo, and the site must make no sense for anyone else. The vegetables story, the fifty books, and the filings graph are not transferable. |

**Palette (light only, per decision):**

| token | value | use |
|---|---|---|
| paper | #F7F2E8 | page background |
| paper-deep | #EDE5D6 | asides, footnote blocks |
| ink | #1E1A15 | body text |
| ink-soft | #5B544A | captions, metadata |
| rule | #D8CEBC | hairlines, leaders |
| carrot | #D9622B | links, numerals, one accent, named for the vegetables |

**Type:** one serif with real character for display and body, self-hosted (candidates: Newsreader, Literata, Fraunces). One humanist sans for UI labels and footnotes (candidates: Inter Tight, Source Sans 3). Body 18–19px on desktop, measure 60–70 characters, line height 1.55. Drop cap on each chapter's first paragraph. Oldstyle numerals where supported.

**Layout:** single column, max 680px for prose; images may break the column to 900px. Running header on scroll shows the current chapter title. Mobile: 20px gutters, no horizontal scroll, contents collapses to a list.

**Motion:** none beyond native scrolling and a reduced-motion-safe fade on images. No parallax, no scroll-jacking.

**Performance:** static HTML, self-hosted fonts with `font-display: swap`, images as WebP with width-set `<img>` and lazy loading, no client JavaScript except the running header (progressive, optional). Target Lighthouse 100 on all four categories.

## 7. Privacy and honesty rules

- The daughter is "my daughter." No name, no age beyond "three," no photo, ever.
- Book pages shown must use ThinkMocha's generic character art or have names changed. No real child's face.
- Every status tag is true today. Nothing is described as live unless a stranger can use it.
- No metrics on the site that aren't on the resume and LinkedIn (see `/Users/chandni/work/life/linkedin-updates.md` consistency table).
- No mention of the competitor that prompted ThinkMocha's pause.

## 8. Technical design

- **Framework:** Astro 7, static output. Content collections for `work/` and `writing/` (markdown with frontmatter: title, summary, status, date, cover, draft). Home page chapters are an ordered collection too, so copy edits don't touch components.
- **Styling:** plain CSS with custom properties for the tokens above. No Tailwind, no component library.
- **Writing section:** `/writing` route and the nav link render only when the collection has a non-draft entry. RSS via `@astrojs/rss`. YouTube embeds via a lightweight component that loads the iframe on click.
- **Repo:** `chandnisoni/chandnisoni.github.io`, branch `master`. The Astro source replaces the current static files; the old site is preserved in git history and tagged `v1-2016` before removal.
- **Deployment:** GitHub Actions with `withastro/action` building on push to `master` and deploying to GitHub Pages. Pages source switched from "branch root" to "GitHub Actions" (a one-time setting Chandni flips). `CNAME` stays at the repo root via `public/CNAME` so the custom domain survives. Cloudflare stays as is.
- **Resume:** `public/resume.pdf`, replaced by hand when the docx changes.
- **Local dev:** `npm run dev`; Node 26 via nvm.

## 9. Assets needed from Chandni

| asset | for | notes |
|---|---|---|
| Headshot | masthead | recent, natural light, not a LinkedIn crop |
| Kitchen table or workspace photo | chapter i or colophon | phone photo is fine |
| One or two ThinkMocha book spreads | chapter i, appendix C | from the pilot books or `lily-story.pdf`; names changed |
| Edgar Miner screenshots (3–5) and a 60–90s screen recording | chapter iv, appendix A | from the local instance; redact anything client-specific |
| Fundraising Agent screenshots (2–3) | appendix B | front end and one n8n flow |
| Confirmation that chandni@thinkmocha.com receives mail | chapter v | |
| Calendar link | chapter v | placeholder until then |

## 10. Out of scope (for this version)

Dark mode. A product page for the Teams chief-of-staff idea. An investing or thesis page. Newsletter signup (the writing section is built so one can be added). Analytics beyond a privacy-respecting counter if wanted later. Comments.

## 11. Success criteria

- A founder who reads the home page can say, in one sentence, what Chandni builds and why, and knows how to reach her.
- Nothing on the page contradicts the resume or LinkedIn.
- A stranger shown the site alongside three AI-generated portfolios picks this as the human one.
- **Swap test:** with the name and photo replaced, the site cannot plausibly belong to any other person. Reviewed against the AI-tells checklist in §6 before launch; any single failure blocks launch.
- Lighthouse 100/100/100/100 on home and one project page, mobile and desktop.
- Chandni can add a post by adding one markdown file and pushing.

## 12. Open questions

- Typeface pair: final pick after rendering the chapter i copy in each candidate.
- Whether the TechCrunch clipping is used in chapter ii (needs the original article screenshot).
- Whether to add a small "Reading list" or "Five languages" aside to the colophon. Default: no.
