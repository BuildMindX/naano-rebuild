"use client";

import { useActionState } from "react";
import { loginAction, type ActionState } from "@/lib/actions/auth";
import { Input, Label, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(loginAction, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required placeholder="you@company.com" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" required placeholder="Your password" />
      </div>

      <FieldError>{state?.error}</FieldError>

      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? "Logging in..." : "Log in"}
      </Button>

      <p className="text-center text-sm text-black/60">
        No account yet?{" "}
        <Link href="/signup" className="text-accent hover:underline">
          Sign up free
        </Link>
      </p>
    </form>
  );
}
