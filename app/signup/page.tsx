import Link from "next/link";
import { SignupForm } from "./signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const { role } = await searchParams;
  const defaultRole = role === "creator" ? "creator" : "brand";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center text-xl font-semibold tracking-tight text-ink">
          naano
        </Link>
        <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-xl font-semibold text-ink">Create your account</h1>
          <p className="mb-6 text-sm text-black/60">Start free. No card required.</p>
          <SignupForm defaultRole={defaultRole} />
        </div>
      </div>
    </div>
  );
}
