"use client";

import { useTransition } from "react";
import { updateCampaignStatusAction } from "@/lib/actions/campaigns";
import { Button } from "@/components/ui/button";

export function StatusControl({ campaignId, status }: { campaignId: number; status: string }) {
  const [pending, startTransition] = useTransition();

  if (status === "draft") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => startTransition(() => updateCampaignStatusAction(campaignId, "active"))}
      >
        Publish campaign
      </Button>
    );
  }

  if (status === "active") {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => startTransition(() => updateCampaignStatusAction(campaignId, "completed"))}
      >
        Mark completed
      </Button>
    );
  }

  return null;
}
