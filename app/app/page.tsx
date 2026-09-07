import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { campaigns, campaignCreators, users, creatorProfiles } from "@/lib/db/schema";
import { eq, inArray, sql } from "drizzle-orm";
import { StatCard, Badge } from "@/components/ui/stat-card";
import { LinkButton } from "@/components/ui/button";
import { formatCurrency, formatNumber, STATUS_LABELS } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  if (user.role === "brand") {
    const myCampaigns = await db.select().from(campaigns).where(eq(campaigns.brandId, user.id));
    const campaignIds = myCampaigns.map((c) => c.id);

    const collabs = campaignIds.length
      ? await db
          .select()
          .from(campaignCreators)
          .where(inArray(campaignCreators.campaignId, campaignIds))
      : [];

    const totals = collabs.reduce(
      (acc, c) => {
        acc.impressions += c.impressions;
        acc.clicks += c.clicks;
        acc.leads += c.leads;
        acc.pipeline += parseFloat(c.pipelineValue);
        return acc;
      },
      { impressions: 0, clicks: 0, leads: 0, pipeline: 0 }
    );

    const activeCollabs = collabs.filter((c) => !["declined"].includes(c.status));
    const recentCampaigns = myCampaigns.slice(0, 5);

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-ink">Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
            <p className="mt-1 text-black/60">Your creator campaigns at a glance.</p>
          </div>
          <LinkButton href="/app/campaigns/new">Launch a campaign</LinkButton>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Attributed pipeline" value={formatCurrency(totals.pipeline)} />
          <StatCard label="Impressions" value={formatNumber(totals.impressions)} />
          <StatCard label="Clicks" value={formatNumber(totals.clicks)} />
          <StatCard label="Leads" value={formatNumber(totals.leads)} />
        </div>

        <div className="rounded-2xl border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/10 p-5">
            <h2 className="font-semibold text-ink">Your campaigns</h2>
            <Link href="/app/campaigns" className="text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          {recentCampaigns.length === 0 ? (
            <div className="p-8 text-center text-black/50">
              <p>No campaigns yet.</p>
              <LinkButton href="/app/campaigns/new" className="mt-4" size="sm">
                Create your first campaign
              </LinkButton>
            </div>
          ) : (
            <ul className="divide-y divide-black/10">
              {recentCampaigns.map((c) => (
                <li key={c.id}>
                  <Link href={`/app/campaigns/${c.id}`} className="flex items-center justify-between p-5 hover:bg-black/[0.02]">
                    <div>
                      <p className="font-medium text-ink">{c.title}</p>
                      <p className="text-sm text-black/50">Budget {formatCurrency(c.budget)}</p>
                    </div>
                    <Badge tone={c.status === "active" ? "success" : c.status === "draft" ? "neutral" : "accent"}>
                      {c.status}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {activeCollabs.length > 0 && (
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <h2 className="mb-3 font-semibold text-ink">Collaboration pipeline</h2>
            <div className="flex flex-wrap gap-2">
              {activeCollabs.map((c) => (
                <Badge key={c.id} tone="neutral">
                  {STATUS_LABELS[c.status]}: {activeCollabs.filter((x) => x.status === c.status).length}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // creator dashboard
  const [profile] = await db.select().from(creatorProfiles).where(eq(creatorProfiles.userId, user.id)).limit(1);
  const collabs = await db
    .select({
      id: campaignCreators.id,
      status: campaignCreators.status,
      price: campaignCreators.price,
      payoutStatus: campaignCreators.payoutStatus,
      clicks: campaignCreators.clicks,
      leads: campaignCreators.leads,
      campaignTitle: campaigns.title,
      campaignId: campaigns.id,
    })
    .from(campaignCreators)
    .innerJoin(campaigns, eq(campaignCreators.campaignId, campaigns.id))
    .where(eq(campaignCreators.creatorId, user.id));

  const totalEarned = collabs
    .filter((c) => c.payoutStatus === "paid")
    .reduce((sum, c) => sum + parseFloat(c.price), 0);
  const pendingEarnings = collabs
    .filter((c) => c.payoutStatus !== "paid" && ["accepted", "draft_submitted", "scheduled", "live", "completed"].includes(c.status))
    .reduce((sum, c) => sum + parseFloat(c.price), 0);
  const invites = collabs.filter((c) => c.status === "invited");
  const active = collabs.filter((c) => !["invited", "declined"].includes(c.status));

  const profileComplete = profile && profile.headline && profile.pricePerPost !== "0";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
        <p className="mt-1 text-black/60">Your creator earnings and collaborations.</p>
      </div>

      {!profileComplete && (
        <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5">
          <p className="font-medium text-ink">Finish setting up your profile</p>
          <p className="mt-1 text-sm text-black/60">Add your rate, niche, and bio so brands can find and book you.</p>
          <LinkButton href="/app/profile" className="mt-3" size="sm">
            Complete profile
          </LinkButton>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total earned" value={formatCurrency(totalEarned)} />
        <StatCard label="Pending earnings" value={formatCurrency(pendingEarnings)} />
        <StatCard label="Active collaborations" value={String(active.length)} />
        <StatCard label="New invites" value={String(invites.length)} />
      </div>

      {invites.length > 0 && (
        <div className="rounded-2xl border border-black/10 bg-white">
          <div className="border-b border-black/10 p-5">
            <h2 className="font-semibold text-ink">New invites</h2>
          </div>
          <ul className="divide-y divide-black/10">
            {invites.map((c) => (
              <li key={c.id}>
                <Link href={`/app/collaborations/${c.id}`} className="flex items-center justify-between p-5 hover:bg-black/[0.02]">
                  <div>
                    <p className="font-medium text-ink">{c.campaignTitle}</p>
                    <p className="text-sm text-black/50">Offer {formatCurrency(c.price)}</p>
                  </div>
                  <Badge tone="accent">Invited</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-2xl border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black/10 p-5">
          <h2 className="font-semibold text-ink">My collaborations</h2>
          <Link href="/app/collaborations" className="text-sm font-medium text-accent hover:underline">
            View all
          </Link>
        </div>
        {active.length === 0 ? (
          <div className="p-8 text-center text-black/50">
            <p>No active collaborations yet.</p>
            <LinkButton href="/app/opportunities" className="mt-4" size="sm">
              Browse open campaigns
            </LinkButton>
          </div>
        ) : (
          <ul className="divide-y divide-black/10">
            {active.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link href={`/app/collaborations/${c.id}`} className="flex items-center justify-between p-5 hover:bg-black/[0.02]">
                  <div>
                    <p className="font-medium text-ink">{c.campaignTitle}</p>
                    <p className="text-sm text-black/50">{formatCurrency(c.price)}</p>
                  </div>
                  <Badge tone="neutral">{STATUS_LABELS[c.status]}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
