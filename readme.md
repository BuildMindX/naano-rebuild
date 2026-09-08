# naano, rebuilt

This is my rebuild of [naano.com](https://naano.com) for the 8x take-home. Naano is a B2B
marketplace where brands book LinkedIn creators for sponsored posts and track what those posts
actually generate — clicks, leads, pipeline.

Live: https://naano-rebuild-nine.vercel.app
Agent logs for this build: [`.agent-logs/`](.agent-logs/), setup notes in [`CAPTURE-TEST.md`](CAPTURE-TEST.md)

## What's actually here

Both sides of the marketplace, running against a real Postgres database, not a demo with fake
data baked in.

If you're a brand, you can browse creators (with a fit score once you're viewing them from inside
a specific campaign, since fit only really makes sense against a target audience), write a brief,
invite people or accept applicants, and move each collaboration through invited → accepted → draft
→ scheduled → live → completed. Once a post is live you log leads and pipeline value as they get
matched in your CRM, and schedule/mark payouts.

If you're a creator, you set up a profile, browse open briefs or wait for invites, accept or
decline, submit your post with a tracked link, and watch your earnings.

The tracked links are real — every collaboration gets a `/t/<code>` URL that actually redirects
and actually increments a click counter on the request. That part isn't mocked.

A few things I skipped on purpose:

Impressions are self-reported by the creator when they submit a post. This isn't laziness — the
real naano has the same constraint, since LinkedIn doesn't hand out post analytics to third
parties. Clicks are the one number in this app that's genuinely tracked server-side rather than
typed in by someone.

The "AI-powered brief creation" from the original product became a template picker here (pick an
objective, get pre-filled creator guidelines you can edit). Wiring up an actual LLM call for that
felt like the wrong thing to spend the credential-asking budget on given it's cosmetic to the core
loop, not load-bearing.

There's no PDF contract or invoice generation, just the status lifecycle (contract → invoice →
payout) as a UI, and no in-app messaging between brand and creator — the collaboration's state
transitions carry the conversation instead of a chat box.

## Stack

Next.js 16 app router with server actions, TypeScript, Tailwind v4. Postgres on Neon via Drizzle.
Auth is my own — bcrypt for passwords, signed JWT session cookies, no third-party provider.
Deployed on Vercel.

## Data model

`users` (role: brand or creator) → `creator_profiles` (one per creator) · `campaigns` (owned by a
brand) → `campaign_creators`, which is really the collaboration row — status, price, tracking
code, the impression/click/lead/pipeline numbers, payout status → `click_events`, one row per real
tracked click. It's all in [`lib/db/schema.ts`](lib/db/schema.ts) if you want the exact columns.

## Running it locally

```bash
npm install
cp .env.example .env.local   # DATABASE_URL + SESSION_SECRET
npx drizzle-kit push         # creates the tables
npx tsx lib/db/seed.ts       # 12 demo creator profiles for the marketplace
npm run dev
```

Sign up as a brand in one window and a creator in another (or just two accounts) to see both
sides talk to each other.
