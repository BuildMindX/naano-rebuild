import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CampaignForm } from "./campaign-form";

export default async function NewCampaignPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "brand") redirect("/app");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Build your campaign brief</h1>
        <p className="mt-1 text-black/60">Set the objective, guidelines, and budget. You can invite creators next.</p>
      </div>
      <div className="rounded-2xl border border-black/10 bg-white p-6">
        <CampaignForm />
      </div>
    </div>
  );
}
