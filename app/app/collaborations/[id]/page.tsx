import { getCurrentUser } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { campaignCreators, campaigns, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatNumber } from "@/lib/format";
import { STATUS_LABELS, PAYOUT_LABELS } from "@/lib/status";
import { InviteResponse, SubmitPostForm } from "./actions";
import { headers } from "next/headers";

export default async function CollaborationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "creator") redirect("/app");

  const { id } = await params;
  const collabId = Number(id);

  const [row] = await db
    .select({ collab: campaignCreators, campaign: campaigns, brand: users })
    .from(campaignCreators)
    .innerJoin(campaigns, eq(campaignCreators.campaignId, campaigns.id))
    .innerJoin(users, eq(campaigns.brandId, users.id))
    .where(eq(campaignCreators.id, collabId))
    .limit(1);

  if (!row || row.collab.creatorId !== user.id) notFound();

  const { collab, campaign, brand } = row;

  const hdrs = await headers();
  const host = hdrs.get("host");
  const protocol = host?.includes("localhost") ? "http" : "https";
  const trackingLink = `${protocol}://${host}/t/${collab.trackingCode}`;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold text-ink">{campaign.title}</h1>
        <Badge>{STATUS_LABELS[collab.status]}</Badge>
      </div>
      <p className="text-black/60">{brand.companyName || brand.name} · Offer {formatCurrency(collab.price)}</p>

      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="mb-4 font-semibold text-ink">Brief</h2>
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-black/40">Objective</dt>
            <dd className="mt-1 text-ink">{campaign.objective}</dd>
          </div>
          <div>
            <dt className="text-black/40">Key messages</dt>
            <dd className="mt-1 whitespace-pre-wrap text-ink">{campaign.keyMessages || "—"}</dd>
          </div>
          <div>
            <dt className="text-black/40">Creator guidelines</dt>
            <dd className="mt-1 whitespace-pre-wrap text-ink">{campaign.creatorGuidelines || "—"}</dd>
          </div>
        </dl>
      </div>

      {collab.status === "invited" && (
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <p className="mb-3 text-sm text-black/60">This brand invited you to this campaign.</p>
          <InviteResponse collabId={collab.id} />
        </div>
      )}

      {collab.status === "applied" && (
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/60">
          Application sent — waiting for the brand to respond.
        </div>
      )}

      {collab.status === "accepted" && (
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="mb-3 font-semibold text-ink">Submit your post</h2>
          <p className="mb-1 text-xs text-black/40">
            Share your tracked link in the post: <span className="font-mono text-ink">{trackingLink}</span>
          </p>
          <p className="mb-4 text-xs text-black/40">Clicks on that link are tracked automatically.</p>
          <SubmitPostForm collabId={collab.id} />
        </div>
      )}

      {["draft_submitted", "scheduled", "live", "completed"].includes(collab.status) && (
        <div className="rounded-2xl border border-black/10 bg-white p-6 space-y-4">
          <h2 className="font-semibold text-ink">Your post</h2>
          {collab.postUrl && (
            <a href={collab.postUrl} target="_blank" className="text-sm text-accent hover:underline">
              View post →
            </a>
          )}
          <p className="text-xs text-black/40">
            Tracked link: <span className="font-mono text-ink">{trackingLink}</span>
          </p>
          {["live", "completed"].includes(collab.status) && (
            <div className="grid grid-cols-3 gap-3 border-t border-black/10 pt-4 text-sm">
              <div>
                <p className="text-black/40">Impressions</p>
                <p className="font-medium text-ink">{formatNumber(collab.impressions)}</p>
              </div>
              <div>
                <p className="text-black/40">Clicks</p>
                <p className="font-medium text-ink">{formatNumber(collab.clicks)}</p>
              </div>
              <div>
                <p className="text-black/40">Leads</p>
                <p className="font-medium text-ink">{formatNumber(collab.leads)}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {["accepted", "draft_submitted", "scheduled", "live", "completed"].includes(collab.status) && (
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="mb-2 font-semibold text-ink">Payment</h2>
          <p className="text-sm text-black/60">
            Payout status: <span className="font-medium text-ink">{PAYOUT_LABELS[collab.payoutStatus]}</span>
          </p>
          {collab.payoutDate && (
            <p className="mt-1 text-xs text-black/40">
              {collab.payoutStatus === "paid" ? "Paid" : "Scheduled for"} {new Date(collab.payoutDate).toLocaleDateString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
