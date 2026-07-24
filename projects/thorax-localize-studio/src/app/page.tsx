import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-100">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-cyan)]">
          {DISPLAY_NAME}
        </span>
        <Link
          href="/honesty"
          className="text-sm text-slate-400 underline-offset-4 hover:underline"
        >
          Honesty
        </Link>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="cxr-grid absolute inset-0 opacity-35" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-white md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-200 md:text-3xl">
              Classify thoracic disease — and show where it is on the CXR
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-400">
              Chest imaging teams register exams, review multi-disease findings,
              inspect lesion maps, run clinical validation, and compare against
              classify-only baselines that omit location. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/exams"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-cyan)] px-4 text-sm font-medium text-[var(--studio-ink-deep)] hover:opacity-90"
              >
                Open exam registry
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-white/20 bg-white/5 px-4 text-sm font-medium text-slate-100 hover:bg-white/10"
              >
                Compare vs classify-only
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-cyan)]">
              Findings · lesions · activation maps
            </p>
            {[
              ["Disease classification coverage", 84],
              ["Lesion localization integrity", 78],
              ["Gain vs classify-only baseline", 91],
            ].map(([label, pct], i) => (
              <div
                key={String(label)}
                className={`animate-finding-slide space-y-1 ${i === 1 ? "animate-heatmap-bloom rounded-md p-1" : ""}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-white/10">
                  <div
                    className="h-full rounded bg-[var(--studio-cyan)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-slate-300">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-400">
          Classify-only CXR models report disease labels without lesion location
          for clinical review. Imaging teams need a studio to manage exams,
          findings, lesion maps, and validation — then prove localize plans beat
          classify-only baselines.
        </p>
      </section>

      <section className="border-y border-white/10 bg-black/20 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "CXR exam registry",
                d: "Register PA, lateral, AP, portable, and mixed chest exams.",
              },
              {
                t: "Multi-disease finding console",
                d: "Track pneumonia, effusion, nodule, and more with confidence.",
              },
              {
                t: "Lesion localization",
                d: "Link findings to laterality and boundary clarity records.",
              },
              {
                t: "Activation maps",
                d: "Inspect PCAM-style peak strength and spatial coherence.",
              },
              {
                t: "Clinical validation queue",
                d: "Prioritize reader review before trusting localize plans.",
              },
              {
                t: "Classify+localize compare",
                d: "Score localize plans against classify-only baselines.",
              },
            ].map((item) => (
              <li key={item.t} className="space-y-2">
                <h3 className="font-medium text-white">{item.t}</h3>
                <p className="text-sm text-slate-400">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 text-slate-300">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-white">
          How it works
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-slate-400">
          <li>Register a CXR exam and open the multi-disease finding console.</li>
          <li>Localize lesions and bloom probabilistic activation maps.</li>
          <li>Validate clinically and compare against classify-only.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-500">
          Inspired by{" "}
          <a
            className="underline underline-offset-2"
            href={PAPER_URL}
            target="_blank"
            rel="noreferrer"
          >
            arXiv:2607.09305
          </a>
          . Method-lab experiment — not clinical certification or live PACS.
        </p>
      </section>
    </div>
  );
}
