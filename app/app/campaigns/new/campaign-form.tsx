"use client";

import { useActionState, useState } from "react";
import { createCampaignAction, type ActionState } from "@/lib/actions/campaigns";
import { Input, Label, Textarea, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const GUIDELINE_TEMPLATES: Record<string, string> = {
  "Product launch": "Introduce the product, focus on the core problem it solves, and end with a clear CTA to the landing page. Avoid generic hype language — be specific about outcomes.",
  "Thought leadership": "Share a genuine opinion or lesson learned tied to the brand's category. Light or no direct product mention. Native, first-person voice.",
  "Case study": "Walk through a real customer result with concrete numbers. Tag the customer if possible. Link to the full case study.",
};

export function CampaignForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(createCampaignAction, undefined);
  const [objective, setObjective] = useState("Product launch");
  const [guidelines, setGuidelines] = useState(GUIDELINE_TEMPLATES["Product launch"]);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="title">Campaign title</Label>
        <Input id="title" name="title" required placeholder="e.g. Q4 product launch on LinkedIn" />
      </div>

      <div>
        <Label htmlFor="objectiveType">Objective</Label>
        <select
          id="objectiveType"
          className="w-full rounded-lg border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          value={objective}
          onChange={(e) => {
            setObjective(e.target.value);
            setGuidelines(GUIDELINE_TEMPLATES[e.target.value] ?? "");
          }}
        >
          {Object.keys(GUIDELINE_TEMPLATES).map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
        <input type="hidden" name="objective" value={objective} />
        <p className="mt-1 text-xs text-black/40">Picking an objective auto-fills creator guidelines below — edit freely.</p>
      </div>

      <div>
        <Label htmlFor="targetAudience">Target audience</Label>
        <Input id="targetAudience" name="targetAudience" placeholder="e.g. Sales leaders, RevOps, B2B SaaS founders" />
        <p className="mt-1 text-xs text-black/40">Used to compute audience fit when you browse the marketplace for this campaign.</p>
      </div>

      <div>
        <Label htmlFor="keyMessages">Key messages</Label>
        <Textarea id="keyMessages" name="keyMessages" rows={3} placeholder="The 2-3 points every post should land." />
      </div>

      <div>
        <Label htmlFor="creatorGuidelines">Creator guidelines</Label>
        <Textarea
          id="creatorGuidelines"
          name="creatorGuidelines"
          rows={4}
          value={guidelines}
          onChange={(e) => setGuidelines(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="landingUrl">Tracking destination URL</Label>
        <Input id="landingUrl" name="landingUrl" type="url" placeholder="https://yourproduct.com/campaign-landing" />
        <p className="mt-1 text-xs text-black/40">Creators get a unique tracked link per post that redirects here.</p>
      </div>

      <div>
        <Label htmlFor="budget">Budget (EUR)</Label>
        <Input id="budget" name="budget" type="number" min={0} step={50} placeholder="5000" />
      </div>

      <FieldError>{state?.error}</FieldError>

      <div className="flex gap-3">
        <Button type="submit" name="publish" value="1" disabled={pending}>
          {pending ? "Launching..." : "Launch campaign"}
        </Button>
        <Button type="submit" name="publish" value="0" variant="outline" disabled={pending}>
          Save as draft
        </Button>
      </div>
    </form>
  );
}
