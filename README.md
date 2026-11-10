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

1. **Before the first merge**, in the repo's Settings → Pages, set Source to "GitHub Actions". A site that already deploys from a branch is not switched by the workflow; while the source is still "branch", a push to `master` publishes the raw repo root, which is no longer a site.
2. Merge `redesign` into `master` and push. `.github/workflows/deploy.yml` installs, runs `npm test` (build plus the HTML checks), and deploys `dist/`.
3. Cloudflare in front of the domain needs no change. The custom domain is kept in the Pages settings; `public/CNAME` is a backstop.

Before adding images: drop the files into `public/images/` and set `image` (chapters) or `media` (work entries) in the markdown frontmatter with `width` and `height`. A figure whose file is missing fails the build on purpose.

When the resume changes, export it from Word to both PDF paths in `public/` (see above) and push.
