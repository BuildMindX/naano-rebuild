import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { campaigns, campaignCreators, users, creatorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/stat-card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { CollabCard } from "./collab-card";
import { StatusControl } from "./status-control";
import { headers } from "next/headers";

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") redirect("/app");

  const { id } = await params;
  const campaignId = Number(id);

  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
  if (!campaign || campaign.brandId !== user.id) notFound();

  const collabRows = await db
    .select({ collab: campaignCreators, creator: users, profile: creatorProfiles })
    .from(campaignCreators)
    .innerJoin(users, eq(campaignCreators.creatorId, users.id))
    .leftJoin(creatorProfiles, eq(creatorProfiles.userId, users.id))
    .where(eq(campaignCreators.campaignId, campaignId));

  const totals = collabRows.reduce(
    (acc, r) => {
      acc.impressions += r.collab.impressions;
      acc.clicks += r.collab.clicks;
      acc.leads += r.collab.leads;
      acc.pipeline += parseFloat(r.collab.pipelineValue);
      return acc;
    },
    { impressions: 0, clicks: 0, leads: 0, pipeline: 0 }
  );

  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-ink">{campaign.title}</h1>
            <Badge tone={campaign.status === "active" ? "success" : campaign.status === "draft" ? "neutral" : "accent"}>
              {campaign.status}
            </Badge>
          </div>
          <p className="mt-1 text-black/60">{campaign.objective}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusControl campaignId={campaign.id} status={campaign.status} />
          <LinkButton href={`/app/marketplace?campaignId=${campaign.id}`}>Invite creators</LinkButton>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50">Attributed pipeline</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{formatCurrency(totals.pipeline)}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50">Impressions</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{formatNumber(totals.impressions)}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50">Clicks</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{formatNumber(totals.clicks)}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50">Leads</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{formatNumber(totals.leads)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-6 lg:col-span-1">
          <h2 className="mb-4 font-semibold text-ink">Brief</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-black/40">Target audience</dt>
              <dd className="mt-1 text-ink">{campaign.targetAudience || "—"}</dd>
            </div>
            <div>
              <dt className="text-black/40">Key messages</dt>
              <dd className="mt-1 whitespace-pre-wrap text-ink">{campaign.keyMessages || "—"}</dd>
            </div>
            <div>
              <dt className="text-black/40">Creator guidelines</dt>
              <dd className="mt-1 whitespace-pre-wrap text-ink">{campaign.creatorGuidelines || "—"}</dd>
            </div>
            <div>
              <dt className="text-black/40">Landing URL</dt>
              <dd className="mt-1 break-all text-ink">{campaign.landingUrl || "—"}</dd>
            </div>
            <div>
              <dt className="text-black/40">Budget</dt>
              <dd className="mt-1 text-ink">{formatCurrency(campaign.budget)}</dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <h2 className="font-semibold text-ink">Collaborators ({collabRows.length})</h2>
          {collabRows.length === 0 ? (
            <div className="rounded-2xl border border-black/10 bg-white p-10 text-center text-black/50">
              No creators yet. Invite some from the marketplace.
            </div>
          ) : (
            collabRows.map((r) => (
              <CollabCard
                key={r.collab.id}
                siteUrl={siteUrl}
                collab={{
                  id: r.collab.id,
                  status: r.collab.status,
                  price: r.collab.price,
                  postUrl: r.collab.postUrl,
                  trackingCode: r.collab.trackingCode,
                  scheduledDate: r.collab.scheduledDate ? r.collab.scheduledDate.toISOString() : null,
                  liveDate: r.collab.liveDate ? r.collab.liveDate.toISOString() : null,
                  impressions: r.collab.impressions,
                  clicks: r.collab.clicks,
                  leads: r.collab.leads,
                  pipelineValue: r.collab.pipelineValue,
                  payoutStatus: r.collab.payoutStatus,
                  creatorName: r.creator.name,
                  creatorHeadline: r.profile?.headline ?? "",
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
