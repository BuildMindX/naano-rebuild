const COMPANIES = ["Northwind Labs", "Fielder", "Arcstone", "Loopwave", "Halcyon Ops", "Brightframe", "Cursive", "Waypoint"];

export function TrustedBy() {
  return (
    <section className="border-b border-black/5 bg-[#faf9f7] py-10">
      <div className="container-page">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-wide text-black/40">
          Built for modern B2B go-to-market teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
          {COMPANIES.map((name) => (
            <span key={name} className="text-sm font-semibold tracking-tight text-black/50">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
