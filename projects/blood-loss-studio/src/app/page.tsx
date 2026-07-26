import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative min-h-screen overflow-hidden">
        <div aria-hidden className="mist-fade absolute inset-0 bg-[var(--studio-wash)]" />
        <div aria-hidden className="schema-grid absolute inset-0 opacity-60" />
        <div aria-hidden className="ash-mist absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--bl-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--bl-chalk)]">
            Birth packs for caesarean blood-loss methods — compare weighed-swab
            measurement against haemoglobin-calculated baselines before you lock
            a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--bl-amber)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open packs
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-[var(--bl-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-[var(--bl-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--bl-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-[var(--bl-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Haemoglobin-calculated baselines hide whether weighed-swab measurement
          is more trustworthy after caesarean birth.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Birth packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs for caesarean blood-loss method programs.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Methods and assays</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make weighed-swab methods and haemoglobin assays explicit before
              scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test weighed_swab_measured against haemoglobin_calculated
              soft-sims.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned birth pack for your soft-sim program.</li>
          <li>Configure births, weighed-swab methods, and assay runs.</li>
          <li>
            Run a weighed-swab measured soft-sim, then compare against a
            haemoglobin-calculated baseline.
          </li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
      </section>
      <footer className="border-t border-[var(--studio-line)] px-6 py-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only — not live clinical advice, not EMR write-back, not device
        clearance. Research input:{" "}
        <a
          href={PAPER_URL}
          className="underline text-[var(--bl-teal)]"
          target="_blank"
          rel="noreferrer"
        >
          medRxiv 10.64898/2026.07.16.26358295
        </a>
        . Not an authors&apos; product brand.
      </footer>
    </div>
  );
}

export default LandingPage;
