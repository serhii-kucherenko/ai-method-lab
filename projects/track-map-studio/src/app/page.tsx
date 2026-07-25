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
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--tm-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--tm-mist)]">
            Track packs for intraoperative reconstruction — compare online
            deformable SLAM against offline kinematics-prior baselines before
            you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tracks" className="rounded-md bg-[var(--tm-amber)] px-5 py-2.5 text-sm font-medium text-[var(--tm-ink)]">
              Open tracks
            </Link>
            <Link href="/demo" className="rounded-md border border-[var(--tm-line)]/50 px-5 py-2.5 text-sm text-white">
              See demo
            </Link>
            <Link href="/pricing" className="rounded-md border border-[var(--tm-line)]/50 px-5 py-2.5 text-sm text-white">
              Pricing
            </Link>
            <Link href="/onboarding" className="rounded-md border border-[var(--tm-line)]/50 px-5 py-2.5 text-sm text-white">
              Onboarding
            </Link>
            <Link href="/flows" className="rounded-md border border-[var(--tm-line)]/50 px-5 py-2.5 text-sm text-white">
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Offline priors are not online maps.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Track packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim packs and pose budgets for deformable scenes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Poses and reconstructions</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make motion-aware poses and reconstruction fields explicit before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test online deformable SLAM against offline kinematics-prior baselines.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">How it works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned track pack for your soft-tissue or tool scene.</li>
          <li>Configure pose optimization and reconstruction fields.</li>
          <li>Run a soft-sim and compare online deformable SLAM vs offline kinematics-prior.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-6 text-sm">
          <Link href="/pricing" className="underline text-[var(--tm-teal)]">
            See method-lab pricing tiers
          </Link>
        </p>
      </section>
      <footer className="border-t border-[var(--studio-line)] px-6 py-10 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        <p>
          Soft-sim only — not live robot control, not clinical diagnostic use,
          not FDA cleared, not Track2Map, not the authors&apos; system.
        </p>
        <p className="mt-2">
          Source:{" "}
          <a className="underline" href={PAPER_URL}>
            arXiv 2607.08408
          </a>{" "}
          · authors&apos; code: none published
        </p>
      </footer>
    </div>
  );
}

export default LandingPage;
