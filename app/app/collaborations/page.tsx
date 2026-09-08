import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { campaignCreators, campaigns, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { STATUS_LABELS, STATUS_TONE } from "@/lib/status";
import Link from "next/link";

export default async function CollaborationsPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "creator") redirect("/app");

  const rows = await db
    .select({ collab: campaignCreators, campaign: campaigns, brand: users })
    .from(campaignCreators)
    .innerJoin(campaigns, eq(campaignCreators.campaignId, campaigns.id))
    .innerJoin(users, eq(campaigns.brandId, users.id))
    .where(eq(campaignCreators.creatorId, user.id))
    .orderBy(desc(campaignCreators.createdAt));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">My collaborations</h1>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white p-12 text-center text-black/50">
          No collaborations yet. Browse open campaigns to get started.
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white">
          <ul className="divide-y divide-black/10">
            {rows.map(({ collab, campaign, brand }) => (
              <li key={collab.id}>
                <Link href={`/app/collaborations/${collab.id}`} className="flex items-center justify-between p-5 hover:bg-black/[0.02]">
                  <div>
                    <p className="font-medium text-ink">{campaign.title}</p>
                    <p className="text-sm text-black/50">{brand.companyName || brand.name} · {formatCurrency(collab.price)}</p>
                  </div>
                  <Badge tone={STATUS_TONE[collab.status] ?? "neutral"}>{STATUS_LABELS[collab.status]}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
