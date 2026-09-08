import { formatCurrency } from "@/lib/format";

type Campaign = {
  targetAudience: string;
  keyMessages: string;
  creatorGuidelines: string;
  landingUrl: string;
  budget: string;
};

export function CampaignBrief({ campaign }: { campaign: Campaign }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 lg:col-span-1">
      <h2 className="mb-4 font-semibold text-ink">Brief</h2>
      <dl className="space-y-4 text-sm">
        <div>
          <dt className="text-black/40">Target audience</dt>
          <dd className="mt-1 text-ink">{campaign.targetAudience || "—"}</dd>
        </div>
        <div>
          <dt className="text-black/40">Key messages</dt>
          <dd className="mt-1 whitespace-pre-wrap text-ink">{campaign.keyMessages || "—"}</dd>
        </div>
        <div>
          <dt className="text-black/40">Creator guidelines</dt>
          <dd className="mt-1 whitespace-pre-wrap text-ink">{campaign.creatorGuidelines || "—"}</dd>
        </div>
        <div>
          <dt className="text-black/40">Landing URL</dt>
          <dd className="mt-1 break-all text-ink">{campaign.landingUrl || "—"}</dd>
        </div>
        <div>
          <dt className="text-black/40">Budget</dt>
          <dd className="mt-1 text-ink">{formatCurrency(campaign.budget)}</dd>
        </div>
      </dl>
    </div>
  );
}
