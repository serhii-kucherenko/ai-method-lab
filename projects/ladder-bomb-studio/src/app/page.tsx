import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-amber)]">
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
        <div className="ladder-grid absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-slate)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Find the bomb before it fires
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              OT teams register plants, import IEC 61131-3 ladder programs, run
              formal scans that keep function-block bodies, synthesize triggers,
              and compare against verifiers that drop FB bodies. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/plants">Open plants</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/findings">Open findings</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up animate-scan-pulse mt-12 max-w-xl rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5 [animation-delay:120ms]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--studio-amber)]">
              FB-aware formal plan
            </p>
            <div className="flex flex-col justify-center gap-3">
              {[
                ["Bomb catch rate", 78],
                ["Trigger recovery", 71],
                ["FB fidelity", 84],
              ].map(([label, pct], i) => (
                <div key={String(label)} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-slate-100">
                    <div
                      className="animate-bar-grow h-full rounded bg-[var(--studio-amber)]"
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
          Ladder logic bombs hide inside function-block bodies. Verifiers that
          drop those bodies can miss delayed timers, interlock bypasses, and
          actuator deny paths until the plant is already compromised.
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
                t: "Keep FB bodies",
                d: "Formal plans that retain function-block logic catch bombs shallow models miss.",
              },
              {
                t: "Plant workspace",
                d: "Register sites, criticality, and PLC counts before you import ladders.",
              },
              {
                t: "Trigger synthesis",
                d: "Recover concrete steps that fire each finding so OT can reproduce.",
              },
              {
                t: "Bomb taxonomy",
                d: "Hidden timers, nested FB, interlock bypass, actuator deny, and more.",
              },
              {
                t: "Dropped-FB compare",
                d: "Quantify lift against baselines that strip FB bodies and miss bombs.",
              },
              {
                t: "Honest framing",
                d: "Inspired by formal LLB research — never branded as ESBMC-LLB.",
              },
            ].map((s) => (
              <li key={s.t}>
                <p className="font-medium text-[var(--studio-amber)]">{s.t}</p>
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
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-slate-600">
          <li>Register a plant and import IEC 61131-3 ladder programs.</li>
          <li>Run an FB-aware formal scan (or a dropped-FB baseline).</li>
          <li>Review findings, synthesize triggers, compare plan quality.</li>
        </ol>
      </section>

      <footer className="border-t border-[var(--studio-line)] py-10 text-center text-sm text-slate-500">
        <p>
          Soft simulation for method-lab evaluation — not a live industrial PLC
          verifier.
        </p>
        <p className="mt-2">
          Sources:{" "}
          <a className="underline" href={PAPER_URL}>
            arXiv {PAPER_URL.split("/").pop()}
          </a>
        </p>
      </footer>
    </div>
  );
}
