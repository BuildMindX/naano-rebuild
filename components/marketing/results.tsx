const RESULTS = [
  { label: "Impressions tracked", value: "5M+" },
  { label: "Leads attributed", value: "30K+" },
  { label: "Creators on the platform", value: "3,000+" },
  { label: "Posts published", value: "5K+" },
];

export function Results() {
  return (
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
  );
}
