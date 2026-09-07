import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaignCreators, campaigns, clickEvents } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  const [collab] = await db
    .select({ collab: campaignCreators, landingUrl: campaigns.landingUrl })
    .from(campaignCreators)
    .innerJoin(campaigns, eq(campaignCreators.campaignId, campaigns.id))
    .where(eq(campaignCreators.trackingCode, code))
    .limit(1);

  if (!collab) {
    return NextResponse.redirect(new URL("/", _req.url));
  }

  await db
    .update(campaignCreators)
    .set({ clicks: sql`${campaignCreators.clicks} + 1` })
    .where(eq(campaignCreators.id, collab.collab.id));

  await db.insert(clickEvents).values({ campaignCreatorId: collab.collab.id });

  const destination = collab.landingUrl || new URL("/", _req.url).toString();
  return NextResponse.redirect(destination);
}
