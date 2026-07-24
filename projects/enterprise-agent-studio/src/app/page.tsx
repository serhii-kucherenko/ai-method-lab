import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-emerald)]">
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
        <div className="agent-grid absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-emerald)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Roles that plan together
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Manage ERP domains, orchestrate role agents, run resource plans,
              and compare multi-agent quality against a single unchecked agent.
              {` ${TAGLINE}`}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/domains">Open domains</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/plans">Open plan console</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up relative h-64 overflow-hidden rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5 [animation-delay:120ms]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--studio-emerald)]">
              Role orchestration
            </p>
            <div className="flex h-40 items-center justify-around">
              {["Planner", "Allocator", "Reviewer"].map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div
                    className="animate-node-pulse size-14 rounded-full border-2 border-[var(--studio-emerald)] bg-[var(--studio-emerald-soft)]"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                  <span className="text-xs text-slate-500">{label}</span>
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
          Single unchecked agents collapse under enterprise resource
          constraints, role conflicts, and cross-domain links. Teams need
          orchestrated planners, allocators, and reviewers — not one chat
          session hoping for a feasible plan.
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
                t: "Multi-agent role orchestration",
                d: "Planner, allocator, and reviewer agents negotiate plans with coordination rounds.",
              },
              {
                t: "ERP domain workspaces",
                d: "Finance, supply, HR, manufacturing, and procurement domains with complexity signals.",
              },
              {
                t: "Resource plan console",
                d: "Advance plans through intake, allocate, reconcile, and review stages.",
              },
              {
                t: "Single-agent compare",
                d: "Quantify multi-agent lift against an unchecked single-agent baseline.",
              },
              {
                t: "Auditable runs",
                d: "Export CSV audits and JSON plan runs for platform reviews.",
              },
              {
                t: "Honest framing",
                d: "Inspired by Agentic ERP research — never branded as Agentic ERP.",
              },
            ].map((s) => (
              <li key={s.t}>
                <p className="font-medium text-[var(--studio-emerald)]">{s.t}</p>
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
          <li>Register an ERP domain and attach specialized role agents.</li>
          <li>Run a multi-agent resource plan through intake → allocate → reconcile → review.</li>
          <li>Compare against a single-agent baseline and export the audit trail.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-400">
          Soft simulation for method-lab planning — not a live ERP.{" "}
          <Link href="/honesty" className="underline underline-offset-4">
            Honesty & Sources
          </Link>
          . Paper:{" "}
          <a
            className="underline underline-offset-4"
            href={PAPER_URL}
            target="_blank"
            rel="noreferrer"
          >
            arXiv
          </a>
        </p>
      </section>
    </div>
  );
}
