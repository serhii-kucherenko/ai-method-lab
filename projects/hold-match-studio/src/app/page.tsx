import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="absolute inset-0 bg-[var(--studio-wash)]" />
        <div
          aria-hidden
          className="lattice-pulse absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(196,122,44,0.12) 0 2px, transparent 2px 52px), repeating-linear-gradient(-45deg, rgba(31,122,108,0.1) 0 1px, transparent 1px 40px)",
          }}
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-amber-50 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-amber-50/85 md:text-lg">
            Matching that waits for better passenger–driver experience needs a
            hold studio before first-feasible locks ship as policy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/holds"
              className="rounded-md bg-[var(--studio-amber)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              Open holds
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-amber-200/40 px-5 py-2.5 text-sm text-amber-50 transition hover:border-amber-100"
            >
              Guided demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-amber-200/40 px-5 py-2.5 text-sm text-amber-50 transition hover:border-amber-100"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-amber-200/40 px-5 py-2.5 text-sm text-amber-50 transition hover:border-amber-100"
            >
              Onboarding
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Ride-hail ops often lock the first feasible driver–order pair.
          Experience-aware hold can cut cancellations — but teams need a studio
          to model tiers and guardrails, not another opaque dispatch threshold.
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
                "Hold decision board",
                "Assign experience tiers and hold budgets before broadcast.",
              ],
              [
                "Experience lanes",
                "Score passenger wait/cancel risk and driver idle/income together.",
              ],
              [
                "Match timelines",
                "Walk hold → release → accept → complete on one horizon.",
              ],
              [
                "Experience-aware vs first-feasible",
                "Falsify whether hold control beats immediate lock.",
              ],
              [
                "Honesty fence",
                "Method-lab soft-sim — not EXHOLD or DiDi production control.",
              ],
            ].map(([title, body]) => (
              <li key={title} className="plan-rise">
                <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-600">
          <li>Register a driver–order match candidate.</li>
          <li>Create an experience-aware hold decision with a tier.</li>
          <li>Score passenger and driver experience lanes; add a timeline.</li>
          <li>Compare experience-aware score A vs first-feasible baseline B.</li>
        </ol>
        <p className="mt-4 text-sm text-slate-500">
          Full walkthrough:{" "}
          <Link href="/demo" className="text-[var(--studio-amber-deep)] underline">
            /demo
          </Link>
          . Pricing tease: ops seats + hold-compare usage — see{" "}
          <Link
            href="/pricing"
            className="text-[var(--studio-amber-deep)] underline"
          >
            /pricing
          </Link>
          .
        </p>
      </section>

      <section className="border-t border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Honesty / limits
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Soft-sim method-lab product inspired by experience-aware hold
            control. Not EXHOLD. Not DiDi. Not live marketplace dispatch.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            Sources:{" "}
            <a className="underline" href={PAPER_URL}>
              {PAPER_URL}
            </a>{" "}
            · authors’ code: none published
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/holds"
              className="rounded-md bg-[var(--studio-amber)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open holds
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--studio-line)] px-5 py-2.5 text-sm"
            >
              Start onboarding
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
