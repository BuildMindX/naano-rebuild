import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { campaignCreators, campaigns, users } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { Badge } from "@/components/ui/stat-card";
import { formatCurrency, PAYOUT_LABELS } from "@/lib/utils";
import { PayoutRowActions } from "./payout-actions";

const payoutTone: Record<string, "neutral" | "accent" | "success"> = {
  not_scheduled: "neutral",
  scheduled: "accent",
  paid: "success",
};

export default async function PayoutsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") redirect("/app");

  const myCampaigns = await db.select().from(campaigns).where(eq(campaigns.brandId, user.id));
  const ids = myCampaigns.map((c) => c.id);

  const rows = ids.length
    ? await db
        .select({ collab: campaignCreators, campaign: campaigns, creator: users })
        .from(campaignCreators)
        .innerJoin(campaigns, eq(campaignCreators.campaignId, campaigns.id))
        .innerJoin(users, eq(campaignCreators.creatorId, users.id))
        .where(inArray(campaignCreators.campaignId, ids))
    : [];

  const payable = rows.filter((r) => ["accepted", "draft_submitted", "scheduled", "live", "completed"].includes(r.collab.status));

  const totalPaid = payable.filter((r) => r.collab.payoutStatus === "paid").reduce((s, r) => s + parseFloat(r.collab.price), 0);
  const totalScheduled = payable
    .filter((r) => r.collab.payoutStatus === "scheduled")
    .reduce((s, r) => s + parseFloat(r.collab.price), 0);
  const totalPending = payable
    .filter((r) => r.collab.payoutStatus === "not_scheduled")
    .reduce((s, r) => s + parseFloat(r.collab.price), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Payouts</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50">Paid</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50">Scheduled</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{formatCurrency(totalScheduled)}</p>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-black/50">Awaiting scheduling</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{formatCurrency(totalPending)}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 bg-white">
        {payable.length === 0 ? (
          <div className="p-12 text-center text-black/50">No payable collaborations yet.</div>
        ) : (
          <ul className="divide-y divide-black/10">
            {payable.map(({ collab, campaign, creator }) => (
              <li key={collab.id} className="flex items-center justify-between gap-4 p-5">
                <div>
                  <p className="font-medium text-ink">{creator.name}</p>
                  <p className="text-sm text-black/50">{campaign.title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-ink">{formatCurrency(collab.price)}</span>
                  <Badge tone={payoutTone[collab.payoutStatus]}>{PAYOUT_LABELS[collab.payoutStatus]}</Badge>
                  <PayoutRowActions collabId={collab.id} payoutStatus={collab.payoutStatus} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
