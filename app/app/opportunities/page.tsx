import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { campaigns, campaignCreators, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatCurrency } from "@/lib/utils";
import { ApplyButton } from "./apply-button";

export default async function OpportunitiesPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "creator") redirect("/app");

  const openCampaigns = await db
    .select({ campaign: campaigns, brand: users })
    .from(campaigns)
    .innerJoin(users, eq(campaigns.brandId, users.id))
    .where(eq(campaigns.status, "active"))
    .orderBy(desc(campaigns.createdAt));

  const myApplications = await db
    .select()
    .from(campaignCreators)
    .where(eq(campaignCreators.creatorId, user.id));

  const appliedIds = new Set(myApplications.map((a) => a.campaignId));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Open campaigns</h1>
        <p className="mt-1 text-black/60">Apply to campaigns that fit your audience.</p>
      </div>

      {openCampaigns.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-12 text-center text-black/50">
          No open campaigns right now. Check back soon.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {openCampaigns.map(({ campaign, brand }) => (
            <div key={campaign.id} className="rounded-2xl border border-black/10 bg-white p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-black/40">{brand.companyName || brand.name}</p>
              <p className="mt-1 font-semibold text-ink">{campaign.title}</p>
              <p className="mt-2 line-clamp-3 text-sm text-black/60">{campaign.objective}</p>
              {campaign.targetAudience && (
                <p className="mt-2 text-xs text-black/40">Targeting: {campaign.targetAudience}</p>
              )}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium text-ink">Budget {formatCurrency(campaign.budget)}</span>
                {appliedIds.has(campaign.id) ? (
                  <span className="text-sm text-black/40">Already applied</span>
                ) : (
                  <ApplyButton campaignId={campaign.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
