import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-ink text-white">
      <div className="container-page flex flex-col items-start gap-6 py-24 md:py-32">
        <span className="rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-white/70">
          The B2B LinkedIn creator marketplace
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight md:text-6xl">
          Find the creators your buyers already trust.
        </h1>
        <p className="max-w-xl text-lg text-white/60">
          Launch LinkedIn creator campaigns in days, not months, and track the clicks, leads, and pipeline
          every post generates — all from one place.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link href="/signup?role=brand" className="rounded-full bg-accent px-6 py-3 font-medium text-white hover:bg-accent-dark">
            Launch a campaign
          </Link>
          <a href="#product" className="rounded-full border border-white/20 px-6 py-3 font-medium text-white hover:border-white/40">
            See how naano works
          </a>
        </div>
      </div>
    </section>
  );
}
