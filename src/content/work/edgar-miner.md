---
title: Edgar Miner
summary: It reads every SEC filing so you don't have to.
order: 1
stack: [Python 3.12, Django, Postgres, Celery, Dagster, Redis, HTMX, Alpine.js, Tailwind]
media: []
---
## The problem

If you research companies for a living, the SEC filing archive is where the answers are and where the hours go. A 10-K runs hundreds of pages. The relationships that matter, who owns whom, who sits on which board, which subsidiary signed which agreement, are scattered across exhibits and footnotes, filed over decades, in formats that were never meant to be read by a machine or, honestly, by a person.

## What I built

Edgar Miner ingests the SEC's feed archive and turns filings into structured data you can query, then maps the relationships between the companies in them.

- Ingests the full-index and daily feeds from the SEC archive, backfilled from September 1995.
- Extracts financial facts from XBRL into tables instead of PDFs.
- Builds a graph of company relationships: parents, subsidiaries, officers, directors, counterparties.
- Alerts when a company you follow files something new.
- A chat view that answers questions about a company from its own filings, with citations back to the source.

## How it's built

Django and Postgres hold the data. Dagster runs the ingestion pipelines, with Celery and Redis for the queue. The front end is server-rendered with HTMX and Alpine.js. The repository is private; this page is the public face.

## Where it is

A working prototype on my machine, in progress. The ingestion pipeline and the XBRL extraction run end to end; the relationship graph and the chat are the parts under active work. Screenshots and a short recording will appear here as the interface settles. If you do investment research and want to try it on a company you follow, write to me.
