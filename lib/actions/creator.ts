"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { creatorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ActionState = { error?: string; success?: boolean } | undefined;

const profileSchema = z.object({
  headline: z.string().min(3, "Add a short headline").max(255),
  bio: z.string().max(2000).optional().default(""),
  niche: z.string().min(1, "Pick a niche"),
  country: z.string().max(120).optional().default(""),
  followerCount: z.coerce.number().min(0).default(0),
  pricePerPost: z.coerce.number().min(0).default(0),
  linkedinHandle: z.string().max(255).optional().default(""),
  tags: z.string().max(255).optional().default(""),
});

export async function updateProfileAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user || user.role !== "creator") return { error: "Not authorized." };

  const parsed = profileSchema.safeParse({
    headline: formData.get("headline"),
    bio: formData.get("bio"),
    niche: formData.get("niche"),
    country: formData.get("country"),
    followerCount: formData.get("followerCount"),
    pricePerPost: formData.get("pricePerPost"),
    linkedinHandle: formData.get("linkedinHandle"),
    tags: formData.get("tags"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  await db
    .update(creatorProfiles)
    .set({
      ...parsed.data,
      pricePerPost: String(parsed.data.pricePerPost),
    })
    .where(eq(creatorProfiles.userId, user.id));

  revalidatePath("/app/profile");
  revalidatePath("/app/marketplace");
  return { success: true };
}
