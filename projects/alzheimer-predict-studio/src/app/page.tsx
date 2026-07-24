import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-blue)]">
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
        <div className="clinical-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Alzheimer risk plans that keep missingness visible
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Clinical ML teams manage cohorts, review feature missingness, run
              imputation-free predictions with calibrated uncertainty, and
              compare against impute-then-predict baselines that hide gaps.{" "}
              {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cohorts"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-blue)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Open cohort registry
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 text-sm font-medium text-slate-800 hover:bg-white"
              >
                Compare vs impute-then-predict
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-lilac)]">
              Missingness mask · uncertainty band
            </p>
            {[
              ["Observed missingness honesty", 84],
              ["Calibrated uncertainty quality", 78],
              ["Gain vs impute-then-predict", 86],
            ].map(([label, pct], i) => (
              <div
                key={String(label)}
                className={`animate-fade-up space-y-1 ${i === 0 ? "animate-missingness-mask rounded-md p-1" : ""}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-slate-200/80">
                  <div
                    className={`h-full rounded bg-[var(--studio-blue)] ${i === 1 ? "animate-band-widen" : ""}`}
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
          Impute-then-predict pipelines fill gaps first and understate
          uncertainty. Clinical ML teams need a workspace to register cohorts,
          inspect missingness, run imputation-free models, review calibrated
          bands, and prove they beat fill-then-score baselines before trust
          erodes.
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
                t: "Cohort + missingness workspace",
                d: "Register patient cohorts and feature snapshots with observed missingness.",
              },
              {
                t: "Imputation-free prediction runs",
                d: "Score Alzheimer’s risk without pretending incomplete rows are complete.",
              },
              {
                t: "Calibrated uncertainty review",
                d: "Widen bands with missingness instead of overconfident point estimates.",
              },
              {
                t: "Explanation / feature salience",
                d: "Inspect which signals drive risk under the observed mask.",
              },
              {
                t: "Imputation-free vs impute-then-predict",
                d: "Put honest plans next to fill-then-score baselines.",
              },
            ].map((item) => (
              <li key={item.t}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {item.t}
                </h3>
                <p className="mt-2 text-slate-500">{item.d}</p>
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
          <li>Register the patient cohort and feature missingness snapshot.</li>
          <li>Run imputation-free models and review calibrated uncertainty bands.</li>
          <li>
            Inspect explanations and compare against impute-then-predict.
          </li>
        </ol>
        <p className="mt-8 max-w-2xl text-sm text-slate-500">
          Soft-simulation studio inspired by imputation-free Alzheimer’s risk
          research — not clinical certification or live EHR diagnosis. Sources:{" "}
          <a
            className="text-[var(--studio-blue)] underline-offset-2 hover:underline"
            href={PAPER_URL}
            target="_blank"
            rel="noreferrer"
          >
            {PAPER_URL}
          </a>
        </p>
      </section>
    </div>
  );
}
