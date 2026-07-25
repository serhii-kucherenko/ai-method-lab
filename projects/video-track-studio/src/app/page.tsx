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
              "repeating-linear-gradient(90deg, rgba(232,93,76,0.12) 0 2px, transparent 2px 48px), repeating-linear-gradient(0deg, rgba(42,159,181,0.1) 0 1px, transparent 1px 36px)",
          }}
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-coral)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-sky-50 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-sky-100/85 md:text-lg">
            Long-form scores that claim “watching” need a character-track audit
            before they ship as capability.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/clips"
              className="rounded-md bg-[var(--studio-coral)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              Open clips
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-sky-400/40 px-5 py-2.5 text-sm text-sky-50 transition hover:border-sky-200"
            >
              Guided demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-sky-400/40 px-5 py-2.5 text-sm text-sky-50 transition hover:border-sky-200"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-sky-400/40 px-5 py-2.5 text-sm text-sky-50 transition hover:border-sky-200"
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
          Video-LLMs can look strong on long-episode appearance benches while
          barely reacting when you swap the named character. Eval leads need
          track probes — not another fluency scoreboard.
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
                "Clip + cast registry",
                "Register long-form episodes and named characters before probes run.",
              ],
              [
                "Track-probe workspace",
                "Name-swap, gender-swap, open-ended, and frame-boost diagnostics.",
              ],
              [
                "Failure taxonomy",
                "Label name-invariant, gender-cue, option-bias, and collapse modes.",
              ],
              [
                "Track-aware vs fluency",
                "Falsify whether identity tracking beats MCQ fluency priors.",
              ],
              [
                "Honesty fence",
                "Method-lab soft-sim — not a claim that models watch in production.",
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
          <li>Register a long-form clip and cast characters.</li>
          <li>Run a track probe (name-swap or related diagnosis).</li>
          <li>Record failure taxonomy evidence.</li>
          <li>Compare track-aware score A vs fluency baseline B.</li>
        </ol>
        <p className="mt-4 text-sm text-slate-500">
          Full walkthrough:{" "}
          <Link href="/demo" className="text-[var(--studio-coral-deep)] underline">
            /demo
          </Link>
          . Pricing tease: evaluator seats + probe usage — see{" "}
          <Link
            href="/pricing"
            className="text-[var(--studio-coral-deep)] underline"
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
            Soft-sim method-lab product inspired by character-tracking failure
            diagnostics. Not the authors’ toolkit rebrand. Not production Video
            platform certification.
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
              href="/clips"
              className="rounded-md bg-[var(--studio-coral)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open clips
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
