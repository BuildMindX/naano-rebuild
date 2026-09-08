export function StatCard({ label, value, sublabel }: { label: string; value: string; sublabel?: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-black/50">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink">{value}</p>
      {sublabel && <p className="mt-1 text-sm text-black/50">{sublabel}</p>}
    </div>
  );
}
