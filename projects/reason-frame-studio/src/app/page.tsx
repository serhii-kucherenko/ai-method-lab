import Link from "next/link";
import {
  CLAIM,
  DISPLAY_NAME,
  PAPER_URL,
  TAGLINE,
} from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div
          aria-hidden
          className="absolute inset-0 bg-[var(--studio-wash)]"
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-amber)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-stone-100 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-stone-300 md:text-lg">
            Catch fluent-but-false scientific answers with game-aware
            multi-agent checks before you ship.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/rules"
              className="rounded-md bg-[var(--studio-amber)] px-5 py-2.5 text-sm font-medium text-[var(--studio-ink-deep)] transition hover:brightness-110"
            >
              Open rule packs
            </Link>
            <Link
              href="/honesty"
              className="rounded-md border border-stone-500 px-5 py-2.5 text-sm text-stone-200 transition hover:border-stone-300"
            >
              Honesty fence
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-stone-600">
          Single-agent LLMs sound fluent in rule-based science while quietly
          breaking conservation laws, units, and domain constraints.
          Hallucinations slip past reviews that only check prose.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
            The product
          </h2>
          <p className="mt-3 max-w-2xl text-stone-600">{CLAIM}</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              [
                "Scientific rule packs",
                "Encode physics, chemistry, biology, math, or materials constraints before debate.",
              ],
              [
                "Multi-agent debates",
                "Proposers and challengers argue under referee scoring — not one confident monologue.",
              ],
              [
                "Bayesian / team-game scores",
                "Update beliefs with coordination and evidence grounding, not vibes.",
              ],
              [
                "Hallucination flags",
                "Surface fluent falsehoods and resolve them against the rule pack.",
              ],
              [
                "Multi vs single compare",
                "Dual score A (game plan) vs B (fluent baseline) makes the gap falsifiable.",
              ],
            ].map(([title, body]) => (
              <li key={title}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          How it works
        </h2>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-stone-600">
          <li>Register a scientific rule pack for your domain.</li>
          <li>Configure proposer / challenger / referee agents.</li>
          <li>Run debate rounds and record game scores.</li>
          <li>Review hallucination flags, then compare multi-agent vs single-agent.</li>
        </ol>
        <p className="mt-8 text-sm text-stone-500">
          Inspired by{" "}
          <a
            className="text-[var(--studio-amber)] underline-offset-2 hover:underline"
            href={PAPER_URL}
          >
            arXiv:2607.08403
          </a>
          . Method-lab studio — not a live production LLM gateway.{" "}
          <Link
            className="text-[var(--studio-amber)] underline-offset-2 hover:underline"
            href="/honesty"
          >
            Full honesty fence
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
