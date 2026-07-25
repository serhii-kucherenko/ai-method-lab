import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="absolute inset-0 bg-[var(--studio-wash)]" />
        <div
          aria-hidden
          className="wave-pulse absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(26,154,170,0.14) 0 2px, transparent 2px 48px), repeating-linear-gradient(0deg, rgba(111,154,60,0.1) 0 1px, transparent 1px 36px)",
          }}
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-aqua)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-cyan-50 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-cyan-50/85 md:text-lg">
            Real-time sentence-level sign translation needs a stream studio
            before offline gloss dumps ship as accessibility policy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/streams"
              className="rounded-md bg-[var(--studio-aqua)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              Open streams
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-cyan-200/40 px-5 py-2.5 text-sm text-cyan-50 transition hover:border-cyan-100"
            >
              Guided demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-cyan-200/40 px-5 py-2.5 text-sm text-cyan-50 transition hover:border-cyan-100"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-cyan-200/40 px-5 py-2.5 text-sm text-cyan-50 transition hover:border-cyan-100"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-cyan-200/40 px-5 py-2.5 text-sm text-cyan-50 transition hover:border-cyan-100"
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
          Language-access teams often only have offline batch gloss pipelines.
          Real-time sentence streams need latency budgets and a fair compare
          against batch quality — or institutions ship “wait until done” as
          accessibility.
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
                "Stream registry",
                "Register sign streams with pace, stability, and noise honesty.",
              ],
              [
                "Sentence segments",
                "Cut gloss sentences with boundary confidence, not only full clips.",
              ],
              [
                "Latency budgets",
                "Set flush policy and jitter so stream quality stays in budget.",
              ],
              [
                "Real-time vs offline-batch",
                "Falsify whether streaming beats waiting for the full batch.",
              ],
              [
                "Honesty fence",
                "Method-lab soft-sim — not live interpreter certification.",
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
          <li>Register a sign stream for a language pair.</li>
          <li>Add sentence segments and a latency budget.</li>
          <li>Curate glossary coverage that affects stream quality.</li>
          <li>Compare real-time stream score A vs offline-batch baseline B.</li>
        </ol>
        <p className="mt-4 text-sm text-slate-500">
          Full walkthrough:{" "}
          <Link href="/demo" className="text-[var(--studio-aqua-deep)] underline">
            /demo
          </Link>
          . All named journeys:{" "}
          <Link href="/flows" className="text-[var(--studio-aqua-deep)] underline">
            /flows
          </Link>
          . Pricing tease: institution seats + stream minutes — see{" "}
          <Link
            href="/pricing"
            className="text-[var(--studio-aqua-deep)] underline"
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
            Soft-sim method-lab product inspired by real-time sentence-level
            sign language translation. Not a live interpreter. Not clinical ASL
            adjudication. Not the authors’ production stack.
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
              href="/streams"
              className="rounded-md bg-[var(--studio-aqua)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open streams
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
