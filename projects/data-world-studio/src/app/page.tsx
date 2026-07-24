import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-teal)]">
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
        <div className="world-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Forecast the run before you pay for it
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Teams training autonomous data science agents register workspaces,
              catalog costly operations, and forecast outcomes with a world-model
              plan — structured state, cost-aware decisions, and a lightweight
              sim — instead of burning cycles on trial-and-error. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/workspaces">Open workspaces</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/forecasts">Open forecasts</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up animate-forecast-pulse mt-12 max-w-xl rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5 [animation-delay:120ms]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--studio-teal)]">
              World-model plan quality
            </p>
            <div className="flex flex-col justify-center gap-3">
              {[
                ["Outcome accuracy", 81],
                ["Cost efficiency", 74],
                ["Waste avoided", 79],
              ].map(([label, pct], i) => (
                <div key={String(label)} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-slate-100">
                    <div
                      className="animate-bar-grow h-full rounded bg-[var(--studio-teal)]"
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
          Autonomous DS agents thrash through retries and expensive ops before
          they learn what would have worked. A world-model plan forecasts
          outcomes before execution so teams spend compute where it pays.
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
                t: "Workspace registry",
                d: "Organize datasets and tiers before agents touch costly ops.",
              },
              {
                t: "Cost-aware catalog",
                d: "Tag operations with estimated cost and complexity signals.",
              },
              {
                t: "Pre-execution forecasts",
                d: "World-model plans score outcome accuracy and waste avoided.",
              },
              {
                t: "Agent + rollout audit",
                d: "Compare planned forecasts to executed rollouts over time.",
              },
              {
                t: "Trial-and-error compare",
                d: "Quantify lift versus execute-first baselines that learn late.",
              },
              {
                t: "Honest framing",
                d: "Inspired by the paper’s world-model pattern — honest method-lab framing only.",
              },
            ].map((s) => (
              <li key={s.t}>
                <p className="font-medium text-[var(--studio-teal)]">{s.t}</p>
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
          <li>Register a DS workspace and catalog operations with cost signals.</li>
          <li>Configure agent profiles and run world-model outcome forecasts.</li>
          <li>Roll out planned vs executed, then compare against trial-and-error.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-400">
          Research input:{" "}
          <a className="underline" href={PAPER_URL}>
            {PAPER_URL}
          </a>
        </p>
      </section>
    </div>
  );
}
