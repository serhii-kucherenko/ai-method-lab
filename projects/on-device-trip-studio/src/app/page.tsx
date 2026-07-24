import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

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
        <div className="trip-grid absolute inset-0 opacity-35" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              On-device itineraries that stay feasible before they chase what
              feels desirable
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Mobile travel teams encode hard constraints, capture desires, and
              run Plan→Learn→Adapt passes — so schedules hold on-device.{" "}
              {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/trips"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-teal)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Open trip briefs
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Compare vs desire-first
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-dusk)]">
              Constraint lock · adapt morph
            </p>
            {[
              ["Schedule feasibility", 88],
              ["Desire fit under caps", 74],
              ["Resource margin", 81],
            ].map(([label, pct], i) => (
              <div
                key={String(label)}
                className="animate-adapt-morph space-y-1"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-slate-100">
                  <div
                    className={`h-full rounded bg-[var(--studio-teal)] ${i === 0 ? "animate-constraint-lock" : ""}`}
                    style={{ width: `${pct}%` }}
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
          Desire-first trip generators break hard schedule and resource
          constraints. Teams need feasibility first — battery floors, transfer
          windows, offline coverage — then soft desire adaptation that still
          holds the line.
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
                t: "Trip workspace",
                d: "Open trip briefs for destinations and duration before planning.",
              },
              {
                t: "Hard constraint encoder",
                d: "Schedule, resource, transfer, and offline caps stay first-class.",
              },
              {
                t: "Desire capture",
                d: "Subjective signals personalize inside the feasible envelope.",
              },
              {
                t: "Plan → Learn → Adapt",
                d: "Feasibility-first passes, then desire lift without breaking hold.",
              },
              {
                t: "Compare baselines",
                d: "See feasibility-first quality vs desire-first drafts that skip constraints.",
              },
            ].map((s) => (
              <li key={s.t}>
                <p className="font-medium text-slate-900">{s.t}</p>
                <p className="mt-1 text-sm text-slate-500">{s.d}</p>
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
          <li>Register a trip brief</li>
          <li>Encode hard planning constraints</li>
          <li>Capture desire signals</li>
          <li>Draft a feasibility-first plan, then adapt</li>
          <li>Compare against a desire-first baseline</li>
        </ol>
      </section>

      <footer className="border-t border-[var(--studio-line)] py-10 text-center text-sm text-slate-500">
        <p>
          Method-lab studio · paper{" "}
          <a className="underline" href={PAPER_URL}>
            {PAPER_URL}
          </a>
        </p>
        <p className="mt-2">
          Soft simulation only — not a live maps or booking API.{" "}
          <Link href="/honesty" className="underline">
            Honesty &amp; Sources
          </Link>
        </p>
      </footer>
    </div>
  );
}
