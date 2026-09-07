import Link from "next/link";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          naano
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#product" className="text-sm text-white/70 hover:text-white">
            Product
          </a>
          <a href="#pricing" className="text-sm text-white/70 hover:text-white">
            Pricing
          </a>
          <a href="#faq" className="text-sm text-white/70 hover:text-white">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-white/70 hover:text-white">
            Log in
          </Link>
          <Link
            href="/signup?role=brand"
            className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
          >
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
