import Link from "next/link";
import { MarketingNav } from "@/components/marketing/nav";

const TRUSTED_BY = ["Northwind Labs", "Fielder", "Arcstone", "Loopwave", "Halcyon Ops", "Brightframe", "Cursive", "Waypoint"];

const STEPS = [
  {
    n: "01",
    title: "Find creators your buyers trust",
    body: "Filter thousands of B2B voices by niche, audience, and price per post. See exactly who reaches the people you're selling to before you spend a euro.",
  },
  {
    n: "02",
    title: "Build a campaign brief in minutes",
    body: "Set your objective, key messages, and creator guidelines with guided templates. No back-and-forth briefs over email.",
  },
  {
    n: "03",
    title: "Manage every collaboration in one place",
    body: "Track invites, drafts, and scheduling from a single pipeline view instead of a dozen DMs and spreadsheets.",
  },
  {
    n: "04",
    title: "Track reach, clicks, and pipeline",
    body: "Every creator gets a unique tracked link. Watch impressions, clicks, and attributed pipeline roll in per post, per creator, per campaign.",
  },
  {
    n: "05",
    title: "Pay creators without the admin",
    body: "Contract, invoice, and payout status in one strip. Schedule a payout and mark it paid when it clears — no separate finance tool.",
  },
];

const RESULTS = [
  { label: "Impressions tracked", value: "5M+" },
  { label: "Leads attributed", value: "30K+" },
  { label: "Creators on the platform", value: "3,000+" },
  { label: "Posts published", value: "5K+" },
];

const CREATOR_POSTS = [
  { name: "Thomas H.", role: "Creator · B2B & AI · 34K followers", hook: "How AI changed our prospecting workflow for wealth managers.", impressions: "42.8K", clicks: "312", leads: "18" },
  { name: "Robin T.", role: "Creator · Sales & AI · 12K followers", hook: "I run my entire prospecting workflow through an AI. Here's how.", impressions: "9K", clicks: "100", leads: "50" },
  { name: "Eric D.", role: "Sales Leader · B2B · 40K followers", hook: "Most sales teams spend 80% of their time on the wrong leads.", impressions: "20K", clicks: "350", leads: "80" },
  { name: "Marina P.", role: "Content Creator · B2B · 34K followers", hook: "My 30-day LinkedIn content system — the exact playbook.", impressions: "100K", clicks: "1,600", leads: "320" },
];

const FAQS = [
  {
    q: "What is naano?",
    a: "naano is a B2B LinkedIn creator marketplace: companies discover and book vetted creators for sponsored LinkedIn campaigns, each at a fixed price per post set by the creator. The marketplace spans creators from niche voices with around 1,000 followers to established B2B creators with audiences of several hundred thousand.",
  },
  {
    q: "How does naano find the right creators?",
    a: "Every creator profile carries a declared niche and tags. When you open the marketplace from inside a campaign, we score every creator against your target audience and objective and sort by fit — so you're not scrolling follower counts to guess relevance.",
  },
  {
    q: "How does per-post pricing work?",
    a: "Creators set their own price per post. When you invite them to a campaign, that price becomes the offer — no bidding, no hidden platform markup baked into the number you see.",
  },
  {
    q: "How does attribution work?",
    a: "Every collaboration gets a unique tracked link. Clicks on that link are recorded automatically the moment someone follows it. Leads and pipeline value are attributed by your team as they get matched in your CRM, and roll up per creator, per campaign, and across your whole account.",
  },
  {
    q: "Do you handle creator payouts?",
    a: "Payouts are tracked through a contract → invoice → payout lifecycle per collaboration. You schedule a payout date and mark it paid once it clears — creators see the same status on their side in real time.",
  },
  {
    q: "What's the difference between Free and Done for you?",
    a: "Self-serve is free: you get the full marketplace, brief builder, and tracking, and you run campaigns yourself. Managed campaigns is a custom-quoted service where naano sources creators and runs the campaign end to end on your behalf.",
  },
];

export default function LandingPage() {
  return (
    <div className="bg-white">
      <MarketingNav />

      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="container-page flex flex-col items-start gap-6 py-24 md:py-32">
          <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/70">
            The B2B LinkedIn creator marketplace
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
            Find the creators your buyers already trust.
          </h1>
          <p className="max-w-xl text-lg text-white/60">
            Launch LinkedIn creator campaigns in days, not months, and track the clicks, leads, and pipeline
            every post generates — all from one place.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/signup?role=brand" className="rounded-full bg-accent px-6 py-3 font-medium text-white hover:bg-accent-dark">
              Launch a campaign
            </Link>
            <a href="#product" className="rounded-full border border-white/20 px-6 py-3 font-medium text-white hover:border-white/40">
              See how naano works
            </a>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="border-b border-black/5 bg-[#faf9f7] py-10">
        <div className="container-page">
          <p className="mb-6 text-center text-xs font-medium uppercase tracking-wide text-black/40">
            Built for modern B2B go-to-market teams
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {TRUSTED_BY.map((name) => (
              <span key={name} className="text-sm font-semibold tracking-tight text-black/50">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Product / how it works */}
      <section id="product" className="py-24">
        <div className="container-page">
          <div className="mb-14 max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              One platform, from brief to results.
            </h2>
            <p className="mt-3 text-lg text-black/60">
              Run creator campaigns from one place — find the right voices, launch faster, and connect every
              post to measurable business results.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {STEPS.map((step) => (
              <div key={step.n} className="rounded-2xl border border-black/10 p-6">
                <span className="text-sm font-medium text-accent">{step.n}</span>
                <h3 className="mt-2 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm text-black/60">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-ink py-24 text-white">
        <div className="container-page">
          <blockquote className="mx-auto max-w-2xl text-center">
            <p className="text-2xl font-medium leading-snug md:text-3xl">
              &ldquo;We used to run creator campaigns off spreadsheets and DMs. naano gave us one pipeline for
              sourcing, briefing, and attribution — our creator channel finally has real numbers behind it.&rdquo;
            </p>
            <footer className="mt-6 text-sm text-white/60">
              Illustrative persona — Elena Marsh, VP Marketing, Fieldstack (fictional example)
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Results */}
      <section className="py-24">
        <div className="container-page">
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-ink">
            Proven across thousands of campaigns.
          </h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {RESULTS.map((r) => (
              <div key={r.label} className="text-center">
                <p className="text-4xl font-semibold text-accent">{r.value}</p>
                <p className="mt-2 text-sm text-black/50">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example posts */}
      <section className="bg-[#faf9f7] py-24">
        <div className="container-page">
          <h2 className="mb-12 text-3xl font-semibold tracking-tight text-ink">Real teams. Measurable pipeline.</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CREATOR_POSTS.map((p) => (
              <div key={p.name} className="rounded-2xl border border-black/10 bg-white p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-sm font-semibold text-accent">
                  {p.name[0]}
                </div>
                <p className="text-sm font-semibold text-ink">{p.name}</p>
                <p className="text-xs text-black/40">{p.role}</p>
                <p className="mt-3 text-sm text-black/70">{p.hook}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-black/10 pt-3 text-xs">
                  <div>
                    <p className="text-black/40">Views</p>
                    <p className="font-medium text-ink">{p.impressions}</p>
                  </div>
                  <div>
                    <p className="text-black/40">Clicks</p>
                    <p className="font-medium text-ink">{p.clicks}</p>
                  </div>
                  <div>
                    <p className="text-black/40">Leads</p>
                    <p className="font-medium text-ink">{p.leads}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="container-page">
          <div className="mb-12 max-w-xl">
            <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Start free. Pay per post when you're ready.
            </h2>
            <p className="mt-3 text-lg text-black/60">Run creator campaigns in-house, or have naano operate them.</p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-black/10 p-8">
              <p className="text-xs font-medium uppercase tracking-wide text-black/40">Self-serve</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">Run it yourself</h3>
              <p className="mt-4 text-3xl font-semibold text-ink">
                €0 <span className="text-base font-normal text-black/40">/ month</span>
              </p>
              <ul className="mt-6 space-y-3 text-sm text-black/70">
                <li>✓ Creator marketplace access</li>
                <li>✓ Guided brief builder</li>
                <li>✓ Track clicks and attributed pipeline</li>
                <li>✓ Automatic creator payout tracking</li>
              </ul>
              <Link
                href="/signup?role=brand"
                className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-dark"
              >
                Start for free
              </Link>
            </div>

            <div className="rounded-2xl border border-black/10 bg-ink p-8 text-white">
              <p className="text-xs font-medium uppercase tracking-wide text-white/50">Managed campaigns</p>
              <h3 className="mt-2 text-xl font-semibold">Get your time back</h3>
              <p className="mt-4 text-3xl font-semibold">Custom quote</p>
              <ul className="mt-6 space-y-3 text-sm text-white/70">
                <li>✓ Campaign strategy and positioning</li>
                <li>✓ Creator sourcing and coordination</li>
                <li>✓ Brief creation and campaign launch</li>
                <li>✓ Reporting and optimisation</li>
              </ul>
              <Link
                href="/signup?role=brand"
                className="mt-8 inline-block rounded-full border border-white/20 px-6 py-3 text-sm font-medium hover:border-white/40"
              >
                Book a campaign call
              </Link>
            </div>
          </div>
          <p className="mt-6 text-sm text-black/40">Campaign spend is separate. No lock-in. Cancel anytime.</p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-[#faf9f7] py-24">
        <div className="container-page max-w-3xl">
          <h2 className="mb-2 text-3xl font-semibold tracking-tight text-ink">Frequently asked questions.</h2>
          <p className="mb-10 text-black/60">Everything you need to know before getting started.</p>
          <div className="divide-y divide-black/10 rounded-2xl border border-black/10 bg-white">
            {FAQS.map((f) => (
              <details key={f.q} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-ink">
                  {f.q}
                  <span className="ml-4 text-black/30 group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-3 text-sm text-black/60">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-ink py-24 text-white">
        <div className="container-page text-center">
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Your next creator campaign starts here.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/60">
            Free to start. Invite your first creator today, or explore the marketplace as a creator looking for
            paid B2B collaborations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signup?role=brand" className="rounded-full bg-accent px-6 py-3 font-medium hover:bg-accent-dark">
              Start for free
            </Link>
            <Link href="/signup?role=creator" className="rounded-full border border-white/20 px-6 py-3 font-medium hover:border-white/40">
              Join as a creator
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink py-12 text-white/50">
        <div className="container-page flex flex-col items-center justify-between gap-4 text-sm md:flex-row">
          <span className="font-semibold text-white/80">naano</span>
          <span>© 2026 naano. Rebuilt as a take-home project — not affiliated with the original naano.com.</span>
        </div>
      </footer>
    </div>
  );
}
