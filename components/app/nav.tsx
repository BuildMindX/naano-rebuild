"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";

type NavItem = { href: string; label: string };

const brandNav: NavItem[] = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/marketplace", label: "Marketplace" },
  { href: "/app/campaigns", label: "Campaigns" },
  { href: "/app/payouts", label: "Payouts" },
];

const creatorNav: NavItem[] = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/opportunities", label: "Opportunities" },
  { href: "/app/collaborations", label: "My collaborations" },
  { href: "/app/profile", label: "Profile" },
];

export function AppNav({ role, name }: { role: "brand" | "creator"; name: string }) {
  const pathname = usePathname();
  const items = role === "brand" ? brandNav : creatorNav;

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/app" className="text-lg font-semibold tracking-tight text-ink">
            naano
          </Link>
          <nav className="hidden gap-1 md:flex">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    active ? "bg-ink text-white" : "text-black/60 hover:bg-black/5 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-black/60 sm:inline">{name}</span>
          <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium uppercase tracking-wide text-black/50">
            {role}
          </span>
          <form action={logoutAction}>
            <button type="submit" className="text-sm font-medium text-black/60 hover:text-ink">
              Log out
            </button>
          </form>
        </div>
      </div>
      <nav className="container-page flex gap-1 overflow-x-auto pb-3 md:hidden">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                active ? "bg-ink text-white" : "text-black/60 hover:bg-black/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
