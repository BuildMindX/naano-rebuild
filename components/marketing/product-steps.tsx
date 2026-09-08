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

export function ProductSteps() {
  return (
    <section id="product" className="py-24">
      <div className="container-page">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">One platform, from brief to results.</h2>
          <p className="mt-3 text-lg text-black/60">
            Run creator campaigns from one place — find the right voices, launch faster, and connect every post to
            measurable business results.
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
  );
}
