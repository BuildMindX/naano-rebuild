export function generateTrackingCode(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function formatCurrency(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function computeFitScore(campaignKeywords: string, creatorTags: string, creatorNiche: string): number {
  const kws = campaignKeywords
    .toLowerCase()
    .split(/[,\s]+/)
    .filter(Boolean);
  if (kws.length === 0) return 70;

  const pool = (creatorTags + " " + creatorNiche).toLowerCase();
  let matches = 0;
  for (const kw of kws) {
    if (pool.includes(kw)) matches++;
  }
  const ratio = matches / kws.length;
  return Math.min(97, Math.round(60 + ratio * 37));
}

export const STATUS_LABELS: Record<string, string> = {
  invited: "Invited",
  applied: "Applied",
  accepted: "Accepted",
  declined: "Declined",
  draft_submitted: "Draft submitted",
  scheduled: "Scheduled",
  live: "Live",
  completed: "Completed",
};

export const PAYOUT_LABELS: Record<string, string> = {
  not_scheduled: "Not scheduled",
  scheduled: "Scheduled",
  paid: "Paid",
};
