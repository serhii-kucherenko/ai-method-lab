import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-crimson)]">
          {DISPLAY_NAME}
        </span>
        <Link
          href="/honesty"
          className="text-sm text-slate-500 underline-offset-4 hover:underline"
        >
          Honesty
        </Link>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--studio-line)]">
        <div className="scan-grid absolute inset-0 opacity-45" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Cardiac CT segmentation with experts in the loop
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Imaging teams register CT studies, run HITL annotation queues,
              track multi-structure segments, review phenotypes, and compare
              against auto-only baselines that skip expert correction.{" "}
              {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/studies"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-crimson)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Open study registry
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 text-sm font-medium text-slate-800 hover:bg-white"
              >
                Compare vs auto-only
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-scan)]">
              HITL queue · multi-structure · phenotype
            </p>
            {[
              ["Expert annotation coverage", 82],
              ["Structure segment completeness", 76],
              ["Gain vs auto-only baseline", 88],
            ].map(([label, pct], i) => (
              <div
                key={String(label)}
                className={`animate-fade-up space-y-1 ${i === 0 ? "animate-annotate-cursor rounded-md p-1" : ""}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-slate-200/80">
                  <div
                    className={`h-full rounded bg-[var(--studio-crimson)] ${i === 2 ? "animate-phenotype-chip" : ""}`}
                    style={{
                      width: `${pct}%`,
                      animationDelay: `${i * 160}ms`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-500">
          Auto-only cardiac CT labels skip expert correction and weaken
          phenotypes. Imaging teams need a studio to manage studies, HITL
          queues, multi-structure segments, and foundation phenotyping — then
          prove they beat auto-only baselines before trust erodes.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]/80 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Cardiac CT study registry",
                d: "Register CCTA, CAC, morphology, and mixed studies with contrast quality.",
              },
              {
                t: "HITL annotation queue",
                d: "Queue expert review, track coverage, and accept corrected labels.",
              },
              {
                t: "Multi-structure segmentation",
                d: "Chambers, myocardium, aorta, coronaries — with Dice estimates.",
              },
              {
                t: "Phenotype review",
                d: "Calcium burden and chamber indices after HITL segments land.",
              },
              {
                t: "HITL vs auto-only compare",
                d: "Score foundation phenotyping plans against auto-only baselines.",
              },
              {
                t: "Augmentation policies",
                d: "Anatomy-preserving intensity, elastic, and crop policies.",
              },
            ].map((item) => (
              <li key={item.t} className="space-y-2">
                <h3 className="font-medium text-slate-900">{item.t}</h3>
                <p className="text-sm text-slate-500">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-slate-600">
          <li>Register a CT study and open the HITL annotation queue.</li>
          <li>Correct multi-structure segments with expert coverage tracked.</li>
          <li>Review phenotype reports and compare against auto-only.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-500">
          Inspired by{" "}
          <a
            className="underline underline-offset-2"
            href={PAPER_URL}
            target="_blank"
            rel="noreferrer"
          >
            arXiv:2607.11287
          </a>
          . Method-lab experiment — not clinical certification or live PACS.
        </p>
      </section>
    </div>
  );
}
