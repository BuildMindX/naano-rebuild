import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { creatorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "creator") redirect("/app");

  const [profile] = await db.select().from(creatorProfiles).where(eq(creatorProfiles.userId, user.id)).limit(1);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Your creator profile</h1>
        <p className="mt-1 text-black/60">Brands see this in the marketplace when they search for creators.</p>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <ProfileForm
          profile={{
            headline: profile?.headline ?? "",
            bio: profile?.bio ?? "",
            niche: profile?.niche ?? "AI & SaaS",
            country: profile?.country ?? "",
            followerCount: profile?.followerCount ?? 0,
            pricePerPost: profile?.pricePerPost ?? "0",
            linkedinHandle: profile?.linkedinHandle ?? "",
            tags: profile?.tags ?? "",
          }}
        />
      </div>
    </div>
  );
}
