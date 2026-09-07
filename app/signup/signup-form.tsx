"use client";

import { useActionState, useState } from "react";
import { signupAction, type ActionState } from "@/lib/actions/auth";
import { Input, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SignupForm({ defaultRole }: { defaultRole: "brand" | "creator" }) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(signupAction, undefined);
  const [role, setRole] = useState<"brand" | "creator">(defaultRole);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label>I am a</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole("brand")}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
              role === "brand" ? "border-accent bg-accent/5 text-accent" : "border-black/15 text-black/60 hover:border-black/30"
            }`}
          >
            Brand booking creators
          </button>
          <button
            type="button"
            onClick={() => setRole("creator")}
            className={`rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
              role === "creator" ? "border-accent bg-accent/5 text-accent" : "border-black/15 text-black/60 hover:border-black/30"
            }`}
          >
            Creator for hire
          </button>
        </div>
        <input type="hidden" name="role" value={role} />
      </div>

      <div>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required placeholder="Jane Doe" />
      </div>

      {role === "brand" && (
        <div>
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" name="companyName" placeholder="Acme Inc." />
        </div>
      )}

      <div>
        <Label htmlFor="email">Work email</Label>
        <Input id="email" name="email" type="email" required placeholder="jane@company.com" />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required minLength={8} placeholder="At least 8 characters" />
      </div>

      <FieldError>{state?.error}</FieldError>

      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-black/60">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
