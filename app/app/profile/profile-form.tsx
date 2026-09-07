"use client";

import { useActionState } from "react";
import { updateProfileAction, type ActionState } from "@/lib/actions/creator";
import { Input, Label, Textarea, Select, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const NICHES = [
  "AI & SaaS",
  "Sales & AI",
  "Sales Leadership",
  "Content & Growth",
  "GTM Strategy",
  "RevOps",
  "Dev Tools & Infra",
  "B2B Marketing",
  "Fintech",
  "HR Tech",
  "Cybersecurity",
  "Procurement",
  "Other",
];

type Profile = {
  headline: string;
  bio: string;
  niche: string;
  country: string;
  followerCount: number;
  pricePerPost: string;
  linkedinHandle: string;
  tags: string;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(updateProfileAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" name="headline" required defaultValue={profile.headline} placeholder="Creator - B2B & AI - 34K followers" />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={4} defaultValue={profile.bio} placeholder="What you write about and who reads you." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="niche">Niche</Label>
          <Select id="niche" name="niche" defaultValue={profile.niche}>
            {NICHES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input id="country" name="country" defaultValue={profile.country} placeholder="France" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="followerCount">LinkedIn followers</Label>
          <Input id="followerCount" name="followerCount" type="number" min={0} defaultValue={profile.followerCount} />
        </div>
        <div>
          <Label htmlFor="pricePerPost">Price per post (EUR)</Label>
          <Input id="pricePerPost" name="pricePerPost" type="number" min={0} defaultValue={profile.pricePerPost} />
        </div>
      </div>

      <div>
        <Label htmlFor="linkedinHandle">LinkedIn profile</Label>
        <Input id="linkedinHandle" name="linkedinHandle" defaultValue={profile.linkedinHandle} placeholder="linkedin.com/in/you" />
      </div>

      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input id="tags" name="tags" defaultValue={profile.tags} placeholder="AI, SaaS, GTM" />
        <p className="mt-1 text-xs text-black/40">Used to match you against brand campaign briefs.</p>
      </div>

      <FieldError>{state?.error}</FieldError>
      {state?.success && <p className="text-sm text-emerald-600">Profile updated.</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save profile"}
      </Button>
    </form>
  );
}
