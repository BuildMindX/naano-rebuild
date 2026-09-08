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

export function Faq() {
  return (
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
  );
}
