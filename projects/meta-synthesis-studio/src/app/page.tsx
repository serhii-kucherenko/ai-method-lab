import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-stone-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-forest)]">
          {DISPLAY_NAME}
        </span>
        <Link
          href="/honesty"
          className="text-sm text-stone-500 underline-offset-4 hover:underline"
        >
          Honesty
        </Link>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--studio-line)]">
        <div className="paper-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-stone-800 md:text-3xl">
              Run meta-analysis as an agentic pipeline
            </h1>
            <p className="mt-4 max-w-lg text-lg text-stone-500">
              Evidence teams move from review question to pooled effect with
              search, screen discipline, extraction, and heterogeneity — not a
              pile of ad-hoc single-pass scripts. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/questions"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-forest)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Open review questions
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-white px-4 text-sm font-medium text-stone-800 hover:bg-stone-50"
              >
                Compare vs ad-hoc
              </Link>
            </div>
          </div>
          <div className="animate-fade-up mt-12 max-w-xl [animation-delay:120ms]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--studio-forest)]">
              Pipeline readiness
            </p>
            <div className="flex flex-col gap-3">
              {[
                ["Screen discipline", 82],
                ["Extraction fidelity", 74],
                ["Heterogeneity check", 78],
              ].map(([label, pct], i) => (
                <div key={String(label)} className="space-y-1">
                  <div className="flex justify-between text-xs text-stone-500">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-stone-100">
                    <div
                      className="animate-bar-grow h-full rounded bg-[var(--studio-forest)]"
                      style={{
                        width: `${pct}%`,
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-stone-500">
          Quantitative meta-analysis is slow when search, screening, extraction,
          and pooling live in separate scripts. Skipping screen discipline or
          heterogeneity leaves pooled effects hard to trust. Meta Synthesis Studio
          keeps the trail visible from question to forest plot.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-white/70 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Review question workspace",
                d: "Capture PICO and keep the question linked through the pipeline.",
              },
              {
                t: "Search + screen queue",
                d: "Build strategies and decide include / exclude with reasons.",
              },
              {
                t: "Effect extraction ledger",
                d: "Record study-level effects before pooling.",
              },
              {
                t: "Pooled analysis + heterogeneity",
                d: "Soft I² and tau² with agentic readiness gaps.",
              },
              {
                t: "Agentic vs ad-hoc compare",
                d: "Quantify lift versus single-pass work that skips screen and hetero.",
              },
              {
                t: "Honest method-lab fence",
                d: "Inspired by the paper — soft sim only, not live PubMed.",
              },
            ].map((item) => (
              <li key={item.t}>
                <p className="font-[family-name:var(--font-display)] text-lg text-stone-900">
                  {item.t}
                </p>
                <p className="mt-2 text-sm text-stone-500">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          How it works
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-stone-600">
          <li>Open a review question with population, intervention, comparator, outcome.</li>
          <li>Craft search strategies, screen citations, extract effects.</li>
          <li>Run agentic pooled analysis and compare against an ad-hoc baseline.</li>
        </ol>
        <p className="mt-8 text-sm text-stone-400">
          Paper:{" "}
          <a className="underline" href={PAPER_URL}>
            {PAPER_URL}
          </a>
        </p>
      </section>
    </div>
  );
}
