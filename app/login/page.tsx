import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 block text-center text-xl font-semibold tracking-tight text-ink">
          naano
        </Link>
        <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-xl font-semibold text-ink">Welcome back</h1>
          <p className="mb-6 text-sm text-black/60">Log in to your naano account.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
