// Rough audience-fit heuristic: how much of a campaign's target-audience/objective
// wording shows up in a creator's declared tags and niche. Not a real ML model,
// just enough signal to rank the marketplace list when you open it from a campaign.
export function computeFitScore(campaignKeywords: string, creatorTags: string, creatorNiche: string): number {
  const keywords = campaignKeywords
    .toLowerCase()
    .split(/[,\s]+/)
    .filter(Boolean);

  if (keywords.length === 0) return 70;

  const pool = `${creatorTags} ${creatorNiche}`.toLowerCase();
  const matches = keywords.filter((kw) => pool.includes(kw)).length;
  const ratio = matches / keywords.length;

  return Math.min(97, Math.round(60 + ratio * 37));
}
