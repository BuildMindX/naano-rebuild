"use client";

import { useState, useTransition } from "react";
import { applyToCampaignAction } from "@/lib/actions/collaborations";
import { Button } from "@/components/ui/button";

export function ApplyButton({ campaignId }: { campaignId: number }) {
  const [pending, startTransition] = useTransition();
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  if (applied) return <span className="text-sm text-emerald-600">Applied ✓</span>;

  return (
    <div>
      <Button
        size="sm"
        disabled={pending}
        onClick={() => {
          startTransition(async () => {
            const res = await applyToCampaignAction(campaignId);
            if (res?.error) setError(res.error);
            else setApplied(true);
          });
        }}
      >
        {pending ? "Applying..." : "Apply"}
      </Button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
