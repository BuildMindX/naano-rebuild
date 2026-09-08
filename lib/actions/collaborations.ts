"use server";

import { db } from "@/lib/db";
import { campaignCreators, campaigns, creatorProfiles } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { generateTrackingCode } from "@/lib/tracking";
import { revalidatePath } from "next/cache";

async function assertCreatorOwns(collabId: number, userId: number) {
  const [row] = await db.select().from(campaignCreators).where(eq(campaignCreators.id, collabId)).limit(1);
  if (!row || row.creatorId !== userId) return null;
  return row;
}

async function assertBrandOwns(collabId: number, userId: number) {
  const [row] = await db
    .select({ collab: campaignCreators, campaign: campaigns })
    .from(campaignCreators)
    .innerJoin(campaigns, eq(campaignCreators.campaignId, campaigns.id))
    .where(eq(campaignCreators.id, collabId))
    .limit(1);
  if (!row || row.campaign.brandId !== userId) return null;
  return row;
}

export async function applyToCampaignAction(campaignId: number) {
  const user = await getCurrentUser();
  if (!user || user.role !== "creator") return { error: "Not authorized." };

  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
  if (!campaign || campaign.status !== "active") return { error: "Campaign is not open." };

  const [profile] = await db.select().from(creatorProfiles).where(eq(creatorProfiles.userId, user.id)).limit(1);

  const existing = await db
    .select()
    .from(campaignCreators)
    .where(and(eq(campaignCreators.campaignId, campaignId), eq(campaignCreators.creatorId, user.id)))
    .limit(1);
  if (existing.length > 0) return { error: "Already applied." };

  await db.insert(campaignCreators).values({
    campaignId,
    creatorId: user.id,
    price: profile?.pricePerPost ?? "0",
    trackingCode: generateTrackingCode(),
    status: "applied",
  });

  revalidatePath("/app/opportunities");
  revalidatePath("/app/collaborations");
  return { success: true };
}

export async function respondToInviteAction(collabId: number, accept: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== "creator") return;
  const row = await assertCreatorOwns(collabId, user.id);
  if (!row || row.status !== "invited") return;

  await db
    .update(campaignCreators)
    .set({ status: accept ? "accepted" : "declined" })
    .where(eq(campaignCreators.id, collabId));

  revalidatePath(`/app/collaborations/${collabId}`);
  revalidatePath("/app/collaborations");
}

export async function respondToApplicantAction(collabId: number, accept: boolean) {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") return;
  const row = await assertBrandOwns(collabId, user.id);
  if (!row || row.collab.status !== "applied") return;

  await db
    .update(campaignCreators)
    .set({ status: accept ? "accepted" : "declined" })
    .where(eq(campaignCreators.id, collabId));

  revalidatePath(`/app/campaigns/${row.campaign.id}`);
}

export async function submitPostAction(collabId: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "creator") return;
  const row = await assertCreatorOwns(collabId, user.id);
  if (!row) return;

  const postUrl = String(formData.get("postUrl") ?? "");
  const impressions = Number(formData.get("impressions") ?? 0);

  await db
    .update(campaignCreators)
    .set({ postUrl, impressions: Math.max(0, impressions), status: "draft_submitted" })
    .where(eq(campaignCreators.id, collabId));

  revalidatePath(`/app/collaborations/${collabId}`);
}

export async function advanceCollabStatusAction(collabId: number, status: "scheduled" | "live" | "completed", extra?: { scheduledDate?: string }) {
  const user = await getCurrentUser();
  if (!user) return;

  const patch: Record<string, unknown> = { status };
  if (status === "scheduled" && extra?.scheduledDate) patch.scheduledDate = new Date(extra.scheduledDate);
  if (status === "live") patch.liveDate = new Date();

  if (user.role === "brand") {
    const row = await assertBrandOwns(collabId, user.id);
    if (!row) return;
    await db.update(campaignCreators).set(patch).where(eq(campaignCreators.id, collabId));
    revalidatePath(`/app/campaigns/${row.campaign.id}`);
  } else {
    const row = await assertCreatorOwns(collabId, user.id);
    if (!row) return;
    await db.update(campaignCreators).set(patch).where(eq(campaignCreators.id, collabId));
    revalidatePath(`/app/collaborations/${collabId}`);
  }
}

export async function updateAttributionAction(collabId: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") return;
  const row = await assertBrandOwns(collabId, user.id);
  if (!row) return;

  const leads = Number(formData.get("leads") ?? 0);
  const pipelineValue = String(formData.get("pipelineValue") ?? "0");

  await db
    .update(campaignCreators)
    .set({ leads: Math.max(0, leads), pipelineValue })
    .where(eq(campaignCreators.id, collabId));

  revalidatePath(`/app/campaigns/${row.campaign.id}`);
}

export async function schedulePayoutAction(collabId: number, formData: FormData) {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") return;
  const row = await assertBrandOwns(collabId, user.id);
  if (!row) return;

  const payoutDate = String(formData.get("payoutDate") ?? "");

  await db
    .update(campaignCreators)
    .set({ payoutStatus: "scheduled", payoutDate: payoutDate ? new Date(payoutDate) : new Date() })
    .where(eq(campaignCreators.id, collabId));

  revalidatePath(`/app/campaigns/${row.campaign.id}`);
  revalidatePath("/app/payouts");
}

export async function markPaidAction(collabId: number) {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") return;
  const row = await assertBrandOwns(collabId, user.id);
  if (!row) return;

  await db
    .update(campaignCreators)
    .set({ payoutStatus: "paid", payoutDate: new Date() })
    .where(eq(campaignCreators.id, collabId));

  revalidatePath(`/app/campaigns/${row.campaign.id}`);
  revalidatePath("/app/payouts");
}
