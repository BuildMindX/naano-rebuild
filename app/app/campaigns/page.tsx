import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { campaigns, campaignCreators } from "@/lib/db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import Link from "next/link";

export default async function CampaignsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") redirect("/app");

  const myCampaigns = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.brandId, user.id))
    .orderBy(desc(campaigns.createdAt));

  const ids = myCampaigns.map((c) => c.id);
  const collabs = ids.length
    ? await db.select().from(campaignCreators).where(inArray(campaignCreators.campaignId, ids))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Campaigns</h1>
        <LinkButton href="/app/campaigns/new">Launch a campaign</LinkButton>
      </div>

      {myCampaigns.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-12 text-center text-black/50">
          No campaigns yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {myCampaigns.map((c) => {
            const creatorCount = collabs.filter((x) => x.campaignId === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/app/campaigns/${c.id}`}
                className="rounded-2xl border border-black/10 bg-white p-5 hover:border-black/20"
              >
                <div className="flex items-start justify-between">
                  <p className="font-semibold text-ink">{c.title}</p>
                  <Badge tone={c.status === "active" ? "success" : c.status === "draft" ? "neutral" : "accent"}>
                    {c.status}
                  </Badge>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-black/60">{c.objective}</p>
                <div className="mt-4 flex items-center justify-between text-sm text-black/50">
                  <span>{creatorCount} creator{creatorCount === 1 ? "" : "s"}</span>
                  <span>{formatCurrency(c.budget)} budget</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
