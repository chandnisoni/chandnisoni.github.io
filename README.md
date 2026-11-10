# chandnisoni.com

Chandni Soni's personal site, written as a short book: five chapters on the home page, three project appendices under `/work/`, and a writing section that appears once the first post is published.

Built with [Astro](https://astro.build), plain CSS, and self-hosted fonts. Hosted on GitHub Pages. The 2016 site is preserved at git tag `v1-2016`.

## Working on it

```sh
source ~/.nvm/nvm.sh && nvm use default   # Node 26
npm install
npm run dev                                # http://localhost:4321
npm test                                   # builds, then checks the built HTML
```

## Adding a post

Add one markdown file to `src/content/writing/`:

```md
---
title: A title
date: 2026-11-10
summary: One sentence for the index and the feed.
youtube: dQw4w9WgXcQ   # optional, loads on click
---
Body in markdown.
```

Leave `draft: true` in the frontmatter until it is ready. Published posts turn on the Writing link in the nav, the `/writing/` index, and `/rss.xml`.

## Replacing the resume

Export the PDF from `ChandniSoni-resume-2026-founder.docx` and save it to both `public/resume.pdf` and `public/ChandniSoni-Resume.pdf` (the second keeps the 2016 link alive).

## Launching

See the section added in the deploy task.
