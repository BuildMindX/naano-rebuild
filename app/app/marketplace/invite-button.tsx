"use client";

import { useState, useTransition } from "react";
import { inviteCreatorAction } from "@/lib/actions/campaigns";
import { Button } from "@/components/ui/button";

export function InviteButton({ campaignId, creatorId }: { campaignId: number; creatorId: number }) {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<"idle" | "invited" | "error">("idle");
  const [message, setMessage] = useState("");

  return (
    <div>
      <Button
        size="sm"
        variant={state === "invited" ? "outline" : "primary"}
        disabled={pending || state === "invited"}
        className="w-full"
        onClick={() => {
          startTransition(async () => {
            const res = await inviteCreatorAction(campaignId, creatorId);
            if (res?.error) {
              setState("error");
              setMessage(res.error);
            } else {
              setState("invited");
            }
          });
        }}
      >
        {pending ? "Inviting..." : state === "invited" ? "Invited" : "Invite to campaign"}
      </Button>
      {state === "error" && <p className="mt-1 text-center text-xs text-red-600">{message}</p>}
    </div>
  );
}
