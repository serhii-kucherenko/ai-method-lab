import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative min-h-screen overflow-hidden">
        <div aria-hidden className="mist-fade absolute inset-0 bg-[var(--studio-wash)]" />
        <div aria-hidden className="schema-grid absolute inset-0 opacity-60" />
        <div aria-hidden className="wave-mist absolute inset-0 opacity-40" />
        <div aria-hidden className="infra-mist absolute inset-0" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--st-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--st-mist)]">
            Therapy packs for early sepsis antibiotic choices — compare
            continuous-time HMM effectiveness models against static guideline
            baselines before you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/therapies" className="rounded-md bg-[var(--st-amber)] px-5 py-2.5 text-sm font-medium text-[var(--st-ink)]">
              Open therapies
            </Link>
            <Link href="/demo" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">
              See demo
            </Link>
            <Link href="/pricing" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">
              Pricing
            </Link>
            <Link href="/onboarding" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">
              Onboarding
            </Link>
            <Link href="/flows" className="rounded-md border border-[var(--st-line)]/50 px-5 py-2.5 text-sm text-white">
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          A guideline sheet is not a latent therapy state.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Therapy packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs and regimen budgets for early sepsis.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Regimens and onsets</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make antibiotic choices and onset windows explicit before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test continuous-time HMM effectiveness against static guideline baselines.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">How it works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned therapy pack for your soft-sim case.</li>
          <li>Configure regimens and onset windows.</li>
          <li>Run a soft-sim and compare CT-HMM vs static guideline.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="underline text-[var(--st-teal)]">
            See method-lab pricing tiers
          </Link>
        </p>
      </section>
      <footer className="border-t border-[var(--studio-line)] px-6 py-10 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        <p>
          Soft-sim only — not clinical diagnostic use, not live EHR write-back,
          not FDA cleared, not the authors&apos; system.
        </p>
        <p className="mt-2">
          Source:{" "}
          <a className="underline" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.03.26357092
          </a>{" "}
          · authors&apos; code: none published
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
