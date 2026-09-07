"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label, Input, Textarea } from "@/components/ui/field";
import { respondToInviteAction, submitPostAction } from "@/lib/actions/collaborations";

export function InviteResponse({ collabId }: { collabId: number }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-2">
      <Button size="sm" disabled={pending} onClick={() => startTransition(() => respondToInviteAction(collabId, true))}>
        Accept invite
      </Button>
      <Button
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() => startTransition(() => respondToInviteAction(collabId, false))}
      >
        Decline
      </Button>
    </div>
  );
}

export function SubmitPostForm({ collabId }: { collabId: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => startTransition(() => submitPostAction(collabId, fd))}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="postUrl">LinkedIn post URL</Label>
        <Input id="postUrl" name="postUrl" type="url" required placeholder="https://linkedin.com/posts/..." />
      </div>
      <div>
        <Label htmlFor="impressions">Impressions (self-reported)</Label>
        <Input id="impressions" name="impressions" type="number" min={0} placeholder="e.g. 12000" />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit draft"}
      </Button>
    </form>
  );
}
