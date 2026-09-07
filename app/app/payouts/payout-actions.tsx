"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { schedulePayoutAction, markPaidAction } from "@/lib/actions/collaborations";

export function PayoutRowActions({ collabId, payoutStatus }: { collabId: number; payoutStatus: string }) {
  const [pending, startTransition] = useTransition();
  const [date, setDate] = useState("");

  if (payoutStatus === "paid") return null;

  if (payoutStatus === "scheduled") {
    return (
      <Button size="sm" disabled={pending} onClick={() => startTransition(() => markPaidAction(collabId))}>
        Mark paid
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="rounded-lg border border-black/15 px-2 py-1 text-sm"
      />
      <Button
        size="sm"
        variant="outline"
        disabled={pending || !date}
        onClick={() => {
          const fd = new FormData();
          fd.set("payoutDate", date);
          startTransition(() => schedulePayoutAction(collabId, fd));
        }}
      >
        Schedule
      </Button>
    </div>
  );
}
