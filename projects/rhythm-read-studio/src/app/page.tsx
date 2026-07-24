import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  DISPLAY_NAME,
  PAPER_URL,
  TAGLINE,
} from "@/claim";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-coral-ink)]">
          {DISPLAY_NAME}
        </span>
        <Link
          href="/honesty"
          className="text-sm text-slate-600 underline-offset-4 hover:underline"
        >
          Honesty
        </Link>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--studio-line)]">
        <div className="rhythm-grid absolute inset-0 opacity-90" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-coral-ink)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Rare rhythms still count
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              Manage ECG cohorts, run long-tail-aware train/eval profiles,
              inspect class balance, and compare angular contrastive scoring
              against flat CE baselines. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/cohorts">Open ECG cohorts</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/train">Start train console</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up relative h-64 overflow-hidden rounded-lg border border-[var(--studio-line)] bg-white/80 p-5 shadow-sm [animation-delay:120ms]">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--studio-coral-ink)]">
              Waveform hint
            </p>
            <svg
              viewBox="0 0 320 120"
              className="h-40 w-full text-[var(--studio-coral)]"
              aria-hidden
            >
              <polyline
                className="animate-wave"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                points="0,60 20,60 28,20 36,100 44,40 52,60 80,60 88,35 96,90 104,50 112,60 160,60 168,25 176,95 184,45 192,60 240,60 248,30 256,100 264,55 272,60 320,60"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Flat classifiers crush rare arrhythmia classes. Common rhythms
          dominate training, and teams cannot see when angular contrastive
          learning plus adaptive priors would lift tail sensitivity.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-white/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Long-tail profiles",
                d: "Angular covariance, adaptive logits, and QRS-band protection as visible knobs.",
              },
              {
                t: "ECG cohort workspaces",
                d: "Register nocturnal and ambulatory cohorts with lead and hours context.",
              },
              {
                t: "Class balance views",
                d: "See head vs rare rhythms before you trust a macro score.",
              },
              {
                t: "Flat CE compare",
                d: "Score angular SCL-style profiles against a no-tail baseline.",
              },
              {
                t: "Auditable runs",
                d: "Export CSV audits and JSON train/eval histories for review.",
              },
              {
                t: "Honest simulation",
                d: "Soft method scores only — not a clinical diagnostic device.",
              },
            ].map((item) => (
              <li key={item.t}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-coral-ink)]">
                  {item.t}
                </h3>
                <p className="mt-2 text-slate-600">{item.d}</p>
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
          <li>Create an ECG cohort and review class prevalence.</li>
          <li>Configure a long-tail-aware train/eval profile and advance stages.</li>
          <li>Compare against flat CE / no-tail, then export the audit trail.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-500">
          Inspired by research on angular Gaussian supervised contrastive
          learning for long-tailed ECG (
          <a className="underline" href={PAPER_URL}>
            paper
          </a>
          ,{" "}
          <a className="underline" href={AUTHORS_CODE_URL}>
            authors&apos; code
          </a>
          ). Not branded as that method. Not for clinical diagnosis.
        </p>
      </section>
    </div>
  );
}
