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
        <div
          aria-hidden
          className="shear-grid absolute inset-0 opacity-60"
        />
        <div
          aria-hidden
          className="flow-mist absolute inset-0"
        />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--studio-cyan)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-200">
            Channel packs with wall-actuation plans — compare evolution-strategy
            closed-loop control against open-loop baselines before you lock a
            pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/channels"
              className="rounded-md bg-[var(--studio-cyan)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open channels
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-slate-300/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-slate-300/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-slate-300/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-slate-300/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          A drag pack is more than an open-loop schedule.
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">{CLAIM}</p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Channel packs</h3>
            <p className="mt-1 text-slate-600">
              Versioned channel geometry and operating assumptions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Actuators and sensors</h3>
            <p className="mt-1 text-slate-600">
              Make wall zones and shear probes explicit before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-slate-600">
              Test ES closed-loop wall control against open-loop/gradient
              baselines.
            </p>
          </div>
        </div>
      </section>
      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-slate-600">
          <strong className="text-[var(--studio-ink)]">Honesty fence:</strong>{" "}
          method-lab soft-sim only; not a live plant controller, not certified
          CFD, and not the authors&apos; system. Source:{" "}
          <a
            className="text-[var(--studio-cyan)] underline"
            href={PAPER_URL}
          >
            arXiv 2607.12626
          </a>
          .
        </div>
      </section>
    </div>
  );
}
