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
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--ud-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--ud-mist)]">
            Allele packs for Usher 1B planning — compare MYO7A supplementation
            against Myo7b activation before you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--ud-amber)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open packs
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-[var(--ud-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-[var(--ud-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--ud-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-[var(--ud-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Allele gaps can hide incomplete MYO7A coverage that Myo7b activation
          soft-sims may exploit.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Allele packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs for Usher 1B pathway programs.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Vectors and assays</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make MYO7A supplementation and Myo7b activation explicit before
              scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test myo7a_gene_supplement against myo7b_activation soft-sims.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned allele pack for your soft-sim program.</li>
          <li>Configure alleles, vector specs, and pathway assay runs.</li>
          <li>
            Run a MYO7A supplementation soft-sim, then compare against Myo7b
            activation.
          </li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
      </section>
      <footer className="border-t border-[var(--studio-line)] px-6 py-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only — not wet-lab validated, not IND/NDA ready, not patient
        dosing, not clinical gene-therapy advice. Research input:{" "}
        <a
          href={PAPER_URL}
          className="underline text-[var(--ud-teal)]"
          target="_blank"
          rel="noreferrer"
        >
          bioRxiv 10.64898/2026.07.02.736025
        </a>
        . Not an authors&apos; product brand.
      </footer>
    </div>
  );
}

export default LandingPage;
