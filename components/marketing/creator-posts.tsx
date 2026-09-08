const POSTS = [
  { name: "Thomas H.", role: "Creator · B2B & AI · 34K followers", hook: "How AI changed our prospecting workflow for wealth managers.", impressions: "42.8K", clicks: "312", leads: "18" },
  { name: "Robin T.", role: "Creator · Sales & AI · 12K followers", hook: "I run my entire prospecting workflow through an AI. Here's how.", impressions: "9K", clicks: "100", leads: "50" },
  { name: "Eric D.", role: "Sales Leader · B2B · 40K followers", hook: "Most sales teams spend 80% of their time on the wrong leads.", impressions: "20K", clicks: "350", leads: "80" },
  { name: "Marina P.", role: "Content Creator · B2B · 34K followers", hook: "My 30-day LinkedIn content system — the exact playbook.", impressions: "100K", clicks: "1,600", leads: "320" },
];

export function CreatorPosts() {
  return (
    <section className="bg-[#faf9f7] py-24">
      <div className="container-page">
        <h2 className="mb-12 text-3xl font-semibold tracking-tight text-ink">Real teams. Measurable pipeline.</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POSTS.map((p) => (
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
  );
}
