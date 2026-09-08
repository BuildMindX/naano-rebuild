"use client";

import { useTransition, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatNumber } from "@/lib/format";
import { STATUS_LABELS, STATUS_TONE, PAYOUT_LABELS } from "@/lib/status";
import {
  respondToApplicantAction,
  advanceCollabStatusAction,
  updateAttributionAction,
  schedulePayoutAction,
  markPaidAction,
} from "@/lib/actions/collaborations";

type Collab = {
  id: number;
  status: string;
  price: string;
  postUrl: string | null;
  trackingCode: string;
  scheduledDate: string | null;
  liveDate: string | null;
  impressions: number;
  clicks: number;
  leads: number;
  pipelineValue: string;
  payoutStatus: string;
  creatorName: string;
  creatorHeadline: string;
};

export function CollabCard({ collab, siteUrl }: { collab: Collab; siteUrl: string }) {
  const [pending, startTransition] = useTransition();
  const [scheduledDate, setScheduledDate] = useState("");
  const [leads, setLeads] = useState(collab.leads);
  const [pipeline, setPipeline] = useState(collab.pipelineValue);
  const [payoutDate, setPayoutDate] = useState("");

  const trackingLink = `${siteUrl}/t/${collab.trackingCode}`;

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold text-ink">{collab.creatorName}</p>
          <p className="text-sm text-black/50">{collab.creatorHeadline}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-ink">{formatCurrency(collab.price)}</span>
          <Badge tone={STATUS_TONE[collab.status] ?? "neutral"}>{STATUS_LABELS[collab.status]}</Badge>
        </div>
      </div>

      {collab.status === "applied" && (
        <div className="mt-4 flex gap-2">
          <Button
            size="sm"
            disabled={pending}
            onClick={() => startTransition(() => respondToApplicantAction(collab.id, true))}
          >
            Accept
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => startTransition(() => respondToApplicantAction(collab.id, false))}
          >
            Decline
          </Button>
        </div>
      )}

      {collab.status === "invited" && (
        <p className="mt-3 text-sm text-black/50">Waiting for the creator to respond to your invite.</p>
      )}

      {collab.status === "accepted" && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-black/50">Waiting for the creator to submit their post.</p>
          <p className="text-xs text-black/40">
            Their tracked link: <span className="font-mono text-ink">{trackingLink}</span>
          </p>
        </div>
      )}

      {collab.status === "draft_submitted" && (
        <div className="mt-3 space-y-3">
          <a href={collab.postUrl ?? "#"} target="_blank" className="text-sm text-accent hover:underline">
            View submitted draft →
          </a>
          <p className="text-xs text-black/40">Self-reported impressions: {formatNumber(collab.impressions)}</p>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="rounded-lg border border-black/15 px-3 py-1.5 text-sm"
            />
            <Button
              size="sm"
              disabled={pending || !scheduledDate}
              onClick={() => startTransition(() => advanceCollabStatusAction(collab.id, "scheduled", { scheduledDate }))}
            >
              Schedule post
            </Button>
          </div>
        </div>
      )}

      {collab.status === "scheduled" && (
        <div className="mt-3 space-y-2">
          <p className="text-sm text-black/50">
            Scheduled for {collab.scheduledDate ? new Date(collab.scheduledDate).toLocaleDateString() : "—"}
          </p>
          <Button size="sm" disabled={pending} onClick={() => startTransition(() => advanceCollabStatusAction(collab.id, "live"))}>
            Mark as live
          </Button>
        </div>
      )}

      {(collab.status === "live" || collab.status === "completed") && (
        <div className="mt-4 space-y-4 border-t border-black/10 pt-4">
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-black/40">Impressions</p>
              <p className="font-medium text-ink">{formatNumber(collab.impressions)}</p>
            </div>
            <div>
              <p className="text-black/40">Clicks (tracked)</p>
              <p className="font-medium text-ink">{formatNumber(collab.clicks)}</p>
            </div>
            <div>
              <p className="text-black/40">Leads</p>
              <p className="font-medium text-ink">{formatNumber(collab.leads)}</p>
            </div>
          </div>

          <p className="text-xs text-black/40">
            Tracked link: <span className="font-mono text-ink">{trackingLink}</span>
          </p>

          <div className="flex flex-wrap items-end gap-2">
            <div>
              <label className="mb-1 block text-xs text-black/50">Leads (from CRM)</label>
              <input
                type="number"
                min={0}
                value={leads}
                onChange={(e) => setLeads(Number(e.target.value))}
                className="w-24 rounded-lg border border-black/15 px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-black/50">Pipeline value (EUR)</label>
              <input
                type="number"
                min={0}
                value={pipeline}
                onChange={(e) => setPipeline(e.target.value)}
                className="w-28 rounded-lg border border-black/15 px-3 py-1.5 text-sm"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => {
                const fd = new FormData();
                fd.set("leads", String(leads));
                fd.set("pipelineValue", pipeline);
                startTransition(() => updateAttributionAction(collab.id, fd));
              }}
            >
              Update attribution
            </Button>
          </div>

          {collab.status === "live" && (
            <Button size="sm" disabled={pending} onClick={() => startTransition(() => advanceCollabStatusAction(collab.id, "completed"))}>
              Mark completed
            </Button>
          )}

          <div className="rounded-xl bg-black/[0.03] p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-black/50">Payment</p>
            <div className="flex items-center gap-4 text-xs text-black/50">
              <span>Contract ✓</span>
              <span>Invoice ✓</span>
              <span className={collab.payoutStatus === "paid" ? "font-medium text-emerald-600" : ""}>
                Payout: {PAYOUT_LABELS[collab.payoutStatus]}
              </span>
            </div>
            {collab.payoutStatus === "not_scheduled" && (
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="date"
                  value={payoutDate}
                  onChange={(e) => setPayoutDate(e.target.value)}
                  className="rounded-lg border border-black/15 px-3 py-1.5 text-sm"
                />
                <Button
                  size="sm"
                  disabled={pending}
                  onClick={() => {
                    const fd = new FormData();
                    fd.set("payoutDate", payoutDate);
                    startTransition(() => schedulePayoutAction(collab.id, fd));
                  }}
                >
                  Schedule payout
                </Button>
              </div>
            )}
            {collab.payoutStatus === "scheduled" && (
              <div className="mt-3">
                <Button size="sm" disabled={pending} onClick={() => startTransition(() => markPaidAction(collab.id))}>
                  Mark as paid
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
