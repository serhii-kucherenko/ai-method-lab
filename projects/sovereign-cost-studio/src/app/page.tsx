import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative min-h-screen overflow-hidden">
        <div
          aria-hidden
          className="mist-fade absolute inset-0 bg-[var(--studio-wash)]"
        />
        <div aria-hidden className="schema-grid absolute inset-0 opacity-60" />
        <div aria-hidden className="infra-mist absolute inset-0" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--sc-teal)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--sc-mist)]">
            Cost packs with water–energy–emissions accounting — compare against
            naive cloud-footprint baselines before you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/costs"
              className="rounded-md bg-[var(--sc-teal)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open costs
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-[var(--sc-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-[var(--sc-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--sc-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-[var(--sc-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          A cost pack is more than a cloud-only footprint.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Cost packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs and model budgets for sovereign AI
              infrastructure.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Models and scenarios</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make water–energy–emissions models and infra scenarios explicit
              before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test sovereign-infra accounting against naive cloud-footprint
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
          <li>Create a versioned cost pack for your sovereign infra target.</li>
          <li>Add water–energy–emissions models and infrastructure scenarios.</li>
          <li>Run a soft-sim and compare sovereign W/E/E vs naive cloud footprints.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-4 text-sm">
          Full walkthrough on{" "}
          <Link href="/demo" className="text-[var(--sc-teal)] underline">
            /demo
          </Link>
          . Plans on{" "}
          <Link href="/pricing" className="text-[var(--sc-teal)] underline">
            /pricing
          </Link>
          .
        </p>
      </section>
      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          <strong className="text-[var(--studio-ink)]">Honesty fence:</strong>{" "}
          soft-sim only; not certified carbon audits; not live grid metering;
          not national policy authority; not the authors&apos; system. Source:{" "}
          <a
            className="text-[var(--studio-signal)] underline"
            href={PAPER_URL}
          >
            arXiv 2607.13443
          </a>
          . Authors&apos; code: none published.
        </div>
      </section>
    </div>
  );
}
