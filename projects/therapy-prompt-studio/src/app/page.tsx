import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative min-h-screen overflow-hidden">
        <div
          aria-hidden
          className="mist-fade absolute inset-0 bg-[var(--studio-wash)]"
        />
        <div aria-hidden className="schema-grid absolute inset-0 opacity-60" />
        <div aria-hidden className="gate-thread absolute inset-0 opacity-40" />
        <div aria-hidden className="infra-mist absolute inset-0" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--tp-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--tp-mist)]">
            Prompt packs for high-risk psychiatric scenarios — compare
            structured safety gates against prompt-only baselines before you
            lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/prompts"
              className="rounded-md bg-[var(--tp-amber)] px-5 py-2.5 text-sm font-medium text-[var(--tp-ink)]"
            >
              Open prompts
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-[var(--tp-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-[var(--tp-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--tp-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-[var(--tp-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Prompt engineering alone does not keep therapy LLMs safe.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Prompt packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs and scenario budgets for therapy-safety
              eval.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Scenarios and gates</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make high-risk psychiatric scenarios and structured safety gates
              explicit before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test structured therapy-safety gates against prompt-only safety
              baselines.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned prompt pack for your therapy-safety focus.</li>
          <li>Configure high-risk scenarios and structured safety gates.</li>
          <li>
            Run a soft-sim and compare structured gates vs prompt-only baseline.
          </li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="underline text-[var(--tp-teal)]">
            See method-lab pricing tiers
          </Link>
        </p>
      </section>
      <footer className="border-t border-[var(--studio-line)] px-6 py-10 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        <p>
          Soft-sim only — not clinical therapy, not a crisis hotline, not live
          patient chat write-back, not FDA cleared, not the authors&apos;
          system.
        </p>
        <p className="mt-2">
          Source:{" "}
          <a className="underline" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.16.26358261
          </a>{" "}
          · authors&apos; code: none published
        </p>
        <p className="mt-4">
          <Link href="/prompts" className="underline text-[var(--tp-teal)]">
            Open prompts
          </Link>{" "}
          ·{" "}
          <Link href="/onboarding" className="underline text-[var(--tp-teal)]">
            Onboarding
          </Link>
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
