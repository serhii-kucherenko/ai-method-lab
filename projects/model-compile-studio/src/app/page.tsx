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
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-cyan-ink)]">
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
        <div className="compile-grid absolute inset-0 opacity-90" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-cyan-ink)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              See every pass to the target
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              Register models, configure accelerator targets, run multi-pass
              MLIR-style compile plans, inspect artifacts, and compare against
              naive single-pass baselines. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/models">Open model registry</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/compile">Start compile console</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up relative h-64 overflow-hidden rounded-lg border border-[var(--studio-line)] bg-white/80 p-5 shadow-sm [animation-delay:120ms]">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-[var(--studio-cyan-ink)]">
              Pass timeline
            </p>
            <div className="flex h-40 items-end gap-3">
              {["lower", "fuse", "layout", "emit"].map((label, i) => (
                <div key={label} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="animate-pass-pulse w-full rounded-t bg-[var(--studio-cyan)]/80"
                    style={{
                      height: `${42 + i * 14}%`,
                      animationDelay: `${i * 180}ms`,
                    }}
                  />
                  <span className="text-[10px] text-slate-500">{label}</span>
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
        <p className="mt-3 max-w-2xl text-slate-600">
          Opaque one-shot model exports hide pass failures and target fit.
          Teams cannot tell when a multi-pass plan would have produced better
          IR or binaries than a target-blind dump.
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
                t: "Multi-pass plans",
                d: "Lower, fuse, layout, and emit as a visible timeline — not a black box.",
              },
              {
                t: "Model + target workspaces",
                d: "Register LLM projects and accelerator profiles side by side.",
              },
              {
                t: "Artifact inspection",
                d: "Browse MLIR, optimized IR, and binary snapshots from each run.",
              },
              {
                t: "Single-pass compare",
                d: "Score multi-pass quality against a naive target-blind baseline.",
              },
              {
                t: "Auditable runs",
                d: "Export CSV audits and JSON compile histories for review.",
              },
              {
                t: "Honest simulation",
                d: "Soft plan-quality scores only — no fake chip timing claims.",
              },
            ].map((item) => (
              <li key={item.t}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-cyan-ink)]">
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
          <li>Register a model project and choose a target profile.</li>
          <li>Configure pass budget, fusion, memory, and affinity inputs.</li>
          <li>Advance the compile through lower → optimize → emit.</li>
          <li>Inspect artifacts and compare multi-pass vs single-pass scores.</li>
        </ol>
        <div className="mt-10">
          <Button asChild size="lg">
            <Link href="/models">Enter the studio</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-[var(--studio-line)] py-8 text-center text-sm text-slate-500">
        Inspired by public MLIR / LLM compile research.{" "}
        <a className="underline" href={PAPER_URL}>
          Paper
        </a>{" "}
        ·{" "}
        <a className="underline" href={AUTHORS_CODE_URL}>
          Authors&apos; code
        </a>{" "}
        · Not affiliated with any vendor brand.
      </footer>
    </div>
  );
}
