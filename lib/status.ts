import type { BadgeTone } from "@/components/ui/badge";

export const STATUS_LABELS: Record<string, string> = {
  invited: "Invited",
  applied: "Applied",
  accepted: "Accepted",
  declined: "Declined",
  draft_submitted: "Draft submitted",
  scheduled: "Scheduled",
  live: "Live",
  completed: "Completed",
};

export const STATUS_TONE: Record<string, BadgeTone> = {
  invited: "neutral",
  applied: "warning",
  accepted: "accent",
  declined: "neutral",
  draft_submitted: "warning",
  scheduled: "accent",
  live: "success",
  completed: "success",
};

export const PAYOUT_LABELS: Record<string, string> = {
  not_scheduled: "Not scheduled",
  scheduled: "Scheduled",
  paid: "Paid",
};

export const PAYOUT_TONE: Record<string, BadgeTone> = {
  not_scheduled: "neutral",
  scheduled: "accent",
  paid: "success",
};
