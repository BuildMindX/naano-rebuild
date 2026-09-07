# naano — rebuilt

A rebuild of [naano.com](https://naano.com), a B2B LinkedIn creator marketplace, built in a single
session as an 8x take-home assignment.

**Live:** https://naano-rebuild-nine.vercel.app
**Agent capture logs:** [`.agent-logs/`](.agent-logs/) · [`CAPTURE-TEST.md`](CAPTURE-TEST.md)

## What this is

Naano connects B2B brands with LinkedIn creators for sponsored posts: brands find creators, brief
them, track the clicks/leads/pipeline each post generates, and pay out per collaboration. This
rebuild implements the full loop for both sides of the marketplace, backed by a real Postgres
database (not a mock/localStorage demo):

**As a brand** — browse the creator marketplace (with audience-fit scoring computed against a
campaign's target audience once you open it from inside a campaign), build a campaign brief with
guided objective templates, invite creators or accept applicants, move each collaboration through
its lifecycle (invited → accepted → draft submitted → scheduled → live → completed), attribute
leads/pipeline value as they get matched in your CRM, and schedule + mark creator payouts.

**As a creator** — set up a public profile (niche, price per post, follower count, tags), browse
and apply to open campaign briefs, accept or decline brand invites, submit your post with a unique
tracked link, and see your earnings and payout status per collaboration.

**Real click tracking** — every collaboration gets a unique `/t/<code>` link. Following it is a
real HTTP redirect to the campaign's destination URL, and it increments a click counter and logs
an event on that request — not simulated data.

### What I deliberately left out

- **No LinkedIn API integration** — impressions are self-reported by the creator at submission
  time (same as the real product has to do, since LinkedIn doesn't expose third-party post
  analytics). Clicks are the one metric that's genuinely tracked server-side.
- **No AI-generated briefs** — "AI-powered brief creation" in the original becomes a guided
  template picker here (objective → pre-filled creator guidelines you edit). Wiring an LLM in
  would have meant asking for another API key for a feature that's cosmetic to the core loop.
- **No contract/invoice documents** — the payment strip shows contract → invoice → payout as a
  status lifecycle, but doesn't generate actual PDF documents.
- **No messaging between brand and creator** — collaboration state (accept/decline, submit,
  schedule) carries the workflow instead of freeform chat.

## Stack

- **Next.js 16** (App Router, Turbopack, Server Actions) + **TypeScript** + **Tailwind CSS v4**
- **Postgres** (Neon, serverless) via **Drizzle ORM**
- Auth: bcrypt password hashing + signed JWT session cookies (no third-party auth provider)
- Deployed on **Vercel**

## Data model

`users` (brand or creator role) → `creator_profiles` (1:1 for creators) · `campaigns` (owned by a
brand) → `campaign_creators` (the collaboration join row: status lifecycle, price, tracking code,
impressions/clicks/leads/pipeline, payout status) → `click_events` (one row per real tracked
click). See [`lib/db/schema.ts`](lib/db/schema.ts).

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL (Neon/Postgres) and SESSION_SECRET
npx drizzle-kit push         # create tables
npx tsx lib/db/seed.ts       # seed 12 demo creator profiles for the marketplace
npm run dev
```

Then sign up fresh as a brand and as a creator (two different browsers/incognito windows, or two
accounts) to try both sides of the marketplace.
