import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="mist-fade absolute inset-0 bg-[var(--studio-wash)]" />
        <div aria-hidden className="feature-grid sand-mist absolute inset-0 opacity-50" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-teal)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-slate-100 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-200/90 md:text-lg">
            Feature packs and observation masks for sufficiency checks — compare
            partial-feature performance against full-feature baselines before you
            lock an eval pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/features"
              className="rounded-md bg-[var(--studio-teal)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              Open features
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
          Clinical ML models train on rich feature sets, then meet patients with
          partial observations. Teams lack a bench that shows when a mask is still
          enough versus when it silently underperforms the full-feature baseline.
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
                "Feature packs",
                "Versioned clinical feature catalogs for eval soft-sim.",
              ],
              [
                "Observation masks",
                "Declare which features are present under partial observation.",
              ],
              [
                "Cohort cases",
                "Cases with gold outcomes and segment filters.",
              ],
              [
                "Partial vs full",
                "Falsify whether the mask is sufficient before locking a pack.",
              ],
              [
                "Honesty fence",
                "Soft-sim method-lab packing — not clinical advice, not FDA.",
              ],
            ].map(([t, d]) => (
              <li key={t}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {t}
                </h3>
                <p className="mt-1 text-slate-600">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Sources
        </h2>
        <p className="mt-3 text-slate-600">
          Soft-sim inspired by arXiv paper{" "}
          <a className="text-[var(--studio-teal)] underline" href={PAPER_URL}>
            2607.09165
          </a>
          . Authors&apos; code: none published. Not the paper system; not clinical
          advice.
        </p>
      </section>
    </div>
  );
}
