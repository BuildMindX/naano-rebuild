"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { campaigns, campaignCreators, creatorProfiles, users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { generateTrackingCode } from "@/lib/utils";

export type ActionState = { error?: string } | undefined;

const campaignSchema = z.object({
  title: z.string().min(3, "Give your campaign a title"),
  objective: z.string().min(3, "Describe the objective"),
  targetAudience: z.string().optional().default(""),
  keyMessages: z.string().optional().default(""),
  creatorGuidelines: z.string().optional().default(""),
  landingUrl: z.string().url("Enter a valid URL, including https://").or(z.literal("")).optional().default(""),
  budget: z.coerce.number().min(0).default(0),
});

export async function createCampaignAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") return { error: "Not authorized." };

  const parsed = campaignSchema.safeParse({
    title: formData.get("title"),
    objective: formData.get("objective"),
    targetAudience: formData.get("targetAudience"),
    keyMessages: formData.get("keyMessages"),
    creatorGuidelines: formData.get("creatorGuidelines"),
    landingUrl: formData.get("landingUrl"),
    budget: formData.get("budget"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const status = (formData.get("publish") === "1" ? "active" : "draft") as "active" | "draft";

  const [campaign] = await db
    .insert(campaigns)
    .values({ ...parsed.data, budget: String(parsed.data.budget), brandId: user.id, status })
    .returning();

  redirect(`/app/campaigns/${campaign.id}`);
}

export async function updateCampaignStatusAction(campaignId: number, status: "draft" | "active" | "completed") {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") return;

  await db
    .update(campaigns)
    .set({ status })
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.brandId, user.id)));

  revalidatePath(`/app/campaigns/${campaignId}`);
  revalidatePath("/app/campaigns");
}

export async function inviteCreatorAction(campaignId: number, creatorId: number) {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") return { error: "Not authorized." };

  const [campaign] = await db.select().from(campaigns).where(eq(campaigns.id, campaignId)).limit(1);
  if (!campaign || campaign.brandId !== user.id) return { error: "Campaign not found." };

  const [profile] = await db.select().from(creatorProfiles).where(eq(creatorProfiles.userId, creatorId)).limit(1);
  const [creator] = await db.select().from(users).where(eq(users.id, creatorId)).limit(1);
  if (!creator) return { error: "Creator not found." };

  const existing = await db
    .select()
    .from(campaignCreators)
    .where(and(eq(campaignCreators.campaignId, campaignId), eq(campaignCreators.creatorId, creatorId)))
    .limit(1);
  if (existing.length > 0) return { error: "Already invited to this campaign." };

  await db.insert(campaignCreators).values({
    campaignId,
    creatorId,
    price: profile?.pricePerPost ?? "0",
    trackingCode: generateTrackingCode(),
    status: "invited",
  });

  revalidatePath(`/app/campaigns/${campaignId}`);
  return { success: true };
}
