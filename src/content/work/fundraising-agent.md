---
title: Fundraising Agent
summary: Runs a founder's investor outreach, with a human approving every send.
status: milestone 1 complete
order: 2
stack: [n8n Cloud, Next.js, Google Sheets, Anthropic API]
media: []
---
## The problem

Raising a round is a second full-time job. Founders I know spend 20 hours a week finding investors who fit, writing cold emails, chasing silence, and keeping the warm ones warm between rounds. Almost none of that is judgment. Almost all of it is follow-through.

## What I built

An agent that does the follow-through and leaves the judgment to the founder. The target is cutting that 20 hours a week to under 2 hours of review and approval.

- Raise mode: fit-matches investors against the company, drafts a personalized cold email for each, and queues it for approval.
- Sends only on approval. Nothing goes out that a person did not read.
- Follows up on silence on a schedule the founder sets.
- Update mode: keeps warm investors updated between rounds with a short note, drafted from what changed.

## How it's built

The workflows run on n8n Cloud. The front end, where the founder reviews and approves, is Next.js. Google Sheets is the system of record, so the founder can see and edit everything without a database. Reasoning and drafting use the Anthropic API.

## Where it is

Milestone 1 is complete, as of April 2026: raise mode and update mode both run end to end for one founder, me. The next milestone is a second founder using it on a real raise. Screenshots of the review screen and one of the workflows will appear here.
