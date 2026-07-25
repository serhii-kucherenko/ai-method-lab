import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="absolute inset-0 bg-[var(--studio-wash)]" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(26,122,109,0.14) 0 1px, transparent 1px 64px), repeating-linear-gradient(0deg, rgba(196,122,26,0.1) 0 1px, transparent 1px 48px)",
          }}
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-slate-100 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-200/90 md:text-lg">
            Structured search memory for multi-step retrosynthesis — compare
            agentic memory planning against greedy local search before you lock
            a route pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--studio-amber)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              Open route packs
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-slate-200/40 px-5 py-2.5 text-sm text-slate-100 transition hover:border-slate-100"
            >
              Guided demo
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
          Synthesis-planning leads waste cycles on greedy single-step
          suggestions that forget failed branches and intermediate properties.
          Multi-step campaigns need structured search memory — not only local
          reaction fluency.
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
                "Route pack registry",
                "Version private route packs with searchable target scaffolds.",
              ],
              [
                "Structured search memory",
                "Record tried paths, outcomes, and linked intermediates.",
              ],
              [
                "Intermediate properties",
                "Track MW, logP, reactivity, and availability in one board.",
              ],
              [
                "Memory vs naive compare",
                "Falsify whether structured memory beats greedy local search.",
              ],
              [
                "Honesty fence",
                "Soft-sim planning only — not wet-lab execution or certification.",
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
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-slate-700">
          <li>Route / pack registry for synthesis-planning leads</li>
          <li>Structured search-memory board in one place</li>
          <li>Intermediate property workspace</li>
          <li>Dual A/B score: agentic memory vs naive local search</li>
          <li>Scoreboard, audit, export, pricing, demo, onboarding</li>
        </ol>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Features in this build
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            Marketing landing · Pricing tiers · Guided demo · Onboarding
            checklist · Multi-flow index · Route packs · Candidate routes ·
            Search memory · Intermediates · Dual score panel · A/B compare ·
            Scoreboard · Honesty fence · Soft-sim notes · Org settings · Member
            invite · Bearer auth · Rate limits · Idempotent webhook · Export
            JSON/CSV · Features API · Goldens sample · Audit trail · Guide link
            · Offline try.html · Pagination · Pack search
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 list-decimal space-y-2 pl-5 text-slate-700">
          <li>Register a versioned route pack for a target scaffold.</li>
          <li>Add multi-step candidate routes and intermediate properties.</li>
          <li>Record structured search memory for tried paths.</li>
          <li>Run structured-memory (A) vs naive local (B) compare.</li>
          <li>Review scoreboard, export, and audit before locking a pack.</li>
        </ol>
        <Link
          href="/demo"
          className="mt-6 inline-block text-[var(--studio-teal)] underline"
        >
          Open the step-by-step demo
        </Link>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Pricing
          </h2>
          <p className="mt-3 text-slate-600">
            Hypothetical Solo Planner · Bench Team · Site Packs packaging for
            seats and private route packs — method-lab honesty, not live
            checkout.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-block text-[var(--studio-teal)] underline"
          >
            See tiers
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Honesty / limits
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Soft-sim synthesis-planning experiment inspired by structured-memory
          retrosynthesis research. Not an authors&apos; system rebrand. Not
          wet-lab execution. Not regulatory synthesis certification.
        </p>
        <Link
          href="/honesty"
          className="mt-4 inline-block text-[var(--studio-teal)] underline"
        >
          Read the full fence
        </Link>
      </section>

      <section className="border-t border-[var(--studio-line)] bg-[var(--studio-ink)] text-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-white">
            Sources
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              Paper:{" "}
              <a className="underline" href={PAPER_URL}>
                {PAPER_URL}
              </a>
            </li>
            <li>Authors&apos; code: none published</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--studio-amber)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open route packs
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-slate-500 px-5 py-2.5 text-sm"
            >
              Start onboarding
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
