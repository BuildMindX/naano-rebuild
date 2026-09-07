import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { creatorProfiles, users, campaigns } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { formatCurrency, formatNumber, computeFitScore } from "@/lib/utils";
import { Badge } from "@/components/ui/stat-card";
import { InviteButton } from "./invite-button";

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ campaignId?: string; q?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") redirect("/app");

  const { campaignId, q } = await searchParams;

  const rows = await db
    .select({ profile: creatorProfiles, user: users })
    .from(creatorProfiles)
    .innerJoin(users, eq(creatorProfiles.userId, users.id))
    .orderBy(desc(creatorProfiles.followerCount));

  let activeCampaign = null;
  if (campaignId) {
    const [c] = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, Number(campaignId)))
      .limit(1);
    if (c && c.brandId === user.id) activeCampaign = c;
  }

  const filtered = q
    ? rows.filter(
        (r) =>
          r.profile.niche.toLowerCase().includes(q.toLowerCase()) ||
          r.profile.tags.toLowerCase().includes(q.toLowerCase()) ||
          r.user.name.toLowerCase().includes(q.toLowerCase())
      )
    : rows;

  const withFit = filtered.map((r) => ({
    ...r,
    fit: activeCampaign
      ? computeFitScore(`${activeCampaign.targetAudience} ${activeCampaign.objective}`, r.profile.tags, r.profile.niche)
      : null,
  }));

  if (activeCampaign) {
    withFit.sort((a, b) => (b.fit ?? 0) - (a.fit ?? 0));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Creator marketplace</h1>
        <p className="mt-1 text-black/60">
          {activeCampaign
            ? `Inviting creators to "${activeCampaign.title}" — sorted by audience fit.`
            : "3,000+ vetted B2B creators. Browse by niche, price, and reach."}
        </p>
      </div>

      <form className="flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by niche, tag, or name..."
          className="w-full max-w-md rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
        />
        {campaignId && <input type="hidden" name="campaignId" value={campaignId} />}
        <button className="rounded-lg border border-black/15 px-4 py-2.5 text-sm font-medium hover:border-black/30">
          Search
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {withFit.map(({ profile, user: creator, fit }) => (
          <div key={profile.id} className="flex flex-col rounded-2xl border border-black/10 bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-ink">{creator.name}</p>
                <p className="text-sm text-black/50">{profile.headline}</p>
              </div>
              {fit !== null && (
                <div className="text-right">
                  <p className="text-lg font-semibold text-accent">{fit}%</p>
                  <p className="text-xs text-black/40">fit</p>
                </div>
              )}
            </div>

            <p className="mt-3 line-clamp-3 text-sm text-black/60">{profile.bio}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <Badge>{profile.niche}</Badge>
              {profile.country && <Badge>{profile.country}</Badge>}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-black/10 pt-4 text-sm">
              <div>
                <p className="text-black/40">Followers</p>
                <p className="font-medium text-ink">{formatNumber(profile.followerCount)}</p>
              </div>
              <div>
                <p className="text-black/40">Avg. views</p>
                <p className="font-medium text-ink">{formatNumber(profile.avgImpressions)}</p>
              </div>
              <div>
                <p className="text-black/40">Per post</p>
                <p className="font-medium text-ink">{formatCurrency(profile.pricePerPost)}</p>
              </div>
            </div>

            <div className="mt-4">
              {activeCampaign ? (
                <InviteButton campaignId={activeCampaign.id} creatorId={creator.id} />
              ) : (
                <p className="text-center text-xs text-black/40">Open a campaign to invite creators</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {withFit.length === 0 && (
        <p className="py-12 text-center text-black/50">No creators match your search.</p>
      )}
    </div>
  );
}
