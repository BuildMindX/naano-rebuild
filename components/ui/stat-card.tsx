export function StatCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: string;
  sublabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-black/50">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {sublabel && <p className="mt-1 text-sm text-black/50">{sublabel}</p>}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-black/5 text-black/60",
    accent: "bg-accent/10 text-accent",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}
