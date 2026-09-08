import Link from "next/link";

export function Pricing() {
  return (
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
  );
}
