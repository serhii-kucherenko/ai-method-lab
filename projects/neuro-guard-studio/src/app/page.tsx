import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-steel)]">
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
        <div className="guard-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Simulate the fix before you push it
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Industrial IoT security teams draft LLM defense plans against live
              sensor context, then run Counterfactual Physics Injection before
              actuators move — so interventions do not worsen the outage.{" "}
              {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/sites">Open sites</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/counterfactuals">Open counterfactuals</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up animate-cpi-ripple mt-12 max-w-xl rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5 [animation-delay:120ms]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--studio-amber)]">
              Counterfactual physics injection
            </p>
            <div className="flex flex-col justify-center gap-3">
              {[
                ["Plan safety", 78],
                ["CPI fit", 74],
                ["Cascade avoided", 81],
              ].map(([label, pct], i) => (
                <div key={String(label)} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-slate-100">
                    <div
                      className="animate-bar-grow h-full rounded bg-[var(--studio-steel)]"
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
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-500">
          IIoT defense is still mostly reactive: a threshold fires and operators
          (or scripts) pull a lever. Without a counterfactual check, the wrong
          isolation can cascade the plant. Neuro Guard Studio makes CPI-before-act
          the default path.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-white/70 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "IIoT site workspace",
                d: "Register plants, zones, and criticality before planners touch actuators.",
              },
              {
                t: "Sensor context",
                d: "Stream anomaly scores and metrics into defense plan drafts.",
              },
              {
                t: "LLM defense plans",
                d: "Neuro-agentic plans score safety, CPI fit, and cascade avoided.",
              },
              {
                t: "Counterfactual physics",
                d: "Inject interventions into a soft physics twin before you apply them.",
              },
              {
                t: "Intervention audit",
                d: "Track proposed, approved, applied, and rolled-back actions.",
              },
              {
                t: "Reactive compare",
                d: "Quantify lift versus threshold-alert act-without-CPI baselines.",
              },
            ].map((s) => (
              <li key={s.t}>
                <p className="font-medium text-[var(--studio-steel)]">{s.t}</p>
                <p className="mt-2 text-sm text-slate-500">{s.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-slate-500">
          <li>Register an IIoT site and attach sensor streams with anomaly signals.</li>
          <li>Draft a neuro-agentic defense plan, then run CPI against a soft twin.</li>
          <li>Promote interventions only after cascade risk clears — compare vs reactive.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-500">
          Inspired by{" "}
          <a className="underline" href={PAPER_URL}>
            {PAPER_URL}
          </a>
          . Soft simulation only — see Honesty.
        </p>
      </section>
    </div>
  );
}
