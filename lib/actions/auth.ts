"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users, creatorProfiles } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, createSession, destroySession } from "@/lib/auth";

const signupSchema = z.object({
  role: z.enum(["brand", "creator"]),
  name: z.string().min(1, "Name is required").max(255),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().max(255).optional(),
});

export type ActionState = { error?: string } | undefined;

export async function signupAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    role: formData.get("role"),
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    companyName: formData.get("companyName") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { role, name, email, password, companyName } = parsed.data;

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      role,
      name,
      companyName: role === "brand" ? companyName ?? "" : null,
    })
    .returning();

  if (role === "creator") {
    await db.insert(creatorProfiles).values({
      userId: user.id,
      headline: "",
      bio: "",
      niche: "B2B",
    });
  }

  await createSession(user.id);
  redirect("/app");
}

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { email, password } = parsed.data;

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) {
    return { error: "Invalid email or password." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);
  redirect("/app");
}

export async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/");
}
