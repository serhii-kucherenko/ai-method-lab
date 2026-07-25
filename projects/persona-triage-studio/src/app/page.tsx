import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="mist-fade absolute inset-0 bg-[var(--studio-wash)]" />
        <div
          aria-hidden
          className="dialogue-lines absolute inset-0 opacity-40"
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-coral)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-slate-100 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-200/90 md:text-lg">
            Persona packs and style axes for urgency evaluation — compare
            style-aware triage against idealized-patient baselines before you
            lock an eval pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/personae"
              className="rounded-md bg-[var(--studio-mint)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              Open personae
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-slate-200/40 px-5 py-2.5 text-sm text-slate-100 transition hover:border-slate-100"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-slate-200/40 px-5 py-2.5 text-sm text-slate-100 transition hover:border-slate-100"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-slate-200/40 px-5 py-2.5 text-sm text-slate-100 transition hover:border-slate-100"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-slate-200/40 px-5 py-2.5 text-sm text-slate-100 transition hover:border-slate-100"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Eval leads greenlight triage models on cooperative, articulate
          simulated patients — then real hedging, affect, and verbosity shift
          urgency outcomes. Idealized benches miss communication diversity.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            The product
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">{CLAIM}</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              [
                "Persona packs",
                "Versioned packs with emotional and strategy tags for diverse speakers.",
              ],
              [
                "Conversation cases",
                "Clinical content with gold urgency labels and specialty filters.",
              ],
              [
                "Style axes",
                "Tune hedging, verbosity, affect — and re-score under bias controls.",
              ],
              [
                "Style-aware vs idealized",
                "Falsify whether diversity-aware triage beats articulation theater.",
              ],
              [
                "Honesty fence",
                "Soft-sim method-lab packing — not clinical advice, not FDA.",
              ],
            ].map(([t, d]) => (
              <li key={t}>
                <h3 className="font-medium text-slate-900">{t}</h3>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Selling points
        </h2>
        <ul className="mt-6 space-y-3 text-slate-600">
          <li>Persona packs and style-axis registry</li>
          <li>Conversation-case workspace with gold urgency</li>
          <li>Dual compare: style-aware triage vs idealized-patient baseline</li>
          <li>Disparity / outcome-shift scoreboard</li>
          <li>Pricing, demo, onboarding, and multi-flow index</li>
        </ul>
      </section>

      <section className="border-t border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-12 text-sm text-slate-500">
          <p>
            Soft-sim only. Not clinical advice. Not FDA-cleared. Not the
            authors’ deployed chatbot brand.
          </p>
          <p className="mt-2">
            Sources:{" "}
            <a className="text-[var(--studio-mint)] underline" href={PAPER_URL}>
              arXiv 2607.08625
            </a>{" "}
            · authors’ code: none published
          </p>
        </div>
      </section>
    </div>
  );
}
