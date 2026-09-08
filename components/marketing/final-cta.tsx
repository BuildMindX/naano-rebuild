import Link from "next/link";

export function FinalCta() {
  return (
    <section className="bg-ink py-24 text-white">
      <div className="container-page text-center">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Your next creator campaign starts here.</h2>
        <p className="mx-auto mt-3 max-w-xl text-white/60">
          Free to start. Invite your first creator today, or explore the marketplace as a creator looking for paid
          B2B collaborations.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/signup?role=brand" className="rounded-full bg-accent px-6 py-3 font-medium hover:bg-accent-dark">
            Start for free
          </Link>
          <Link href="/signup?role=creator" className="rounded-full border border-white/20 px-6 py-3 font-medium hover:border-white/40">
            Join as a creator
          </Link>
        </div>
      </div>
    </section>
  );
}
