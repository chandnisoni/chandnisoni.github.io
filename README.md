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

## Editing the home page

The home page is one column of text in `src/pages/index.astro`. Edit the copy there. Numbers must match the resume; `tests/08-copy.test.mjs` checks them against `tests/fixtures/consistency-table.md`.

Slots that are empty until the asset exists, all in `src/data/site.ts`:
- `hero`: a short clip or a storybook spread under the Edgar Miner line.
- `links.edgarMiner`: the public URL; until set, "Ask for access" is a mailto.
- `links.ideas`: the ideas list page; until set, the 87-ideas line has no link.

Work pages live in `src/content/work/*.md` (Edgar Miner, Fundraising Agent, Talewriter).

## Adding a post

## Replacing the resume

Export the PDF from `ChandniSoni-resume-2026-founder.docx` and save it to both `public/resume.pdf` and `public/ChandniSoni-Resume.pdf` (the second keeps the 2016 link alive).

## Launching

1. **Before the first merge**, in the repo's Settings → Pages, set Source to "GitHub Actions". A site that already deploys from a branch is not switched by the workflow; while the source is still "branch", a push to `master` publishes the raw repo root, which is no longer a site.
2. Merge `redesign` into `master` and push. `.github/workflows/deploy.yml` installs, runs `npm test` (build plus the HTML checks), and deploys `dist/`.
3. Cloudflare in front of the domain needs no change. The custom domain is kept in the Pages settings; `public/CNAME` is a backstop.

Before adding images: drop the files into `public/images/` and set `image` (chapters) or `media` (work entries) in the markdown frontmatter with `width` and `height`. A figure whose file is missing fails the build on purpose.

When the resume changes, export it from Word to both PDF paths in `public/` (see above) and push.
