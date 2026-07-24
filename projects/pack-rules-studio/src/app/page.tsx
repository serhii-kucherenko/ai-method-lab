import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-navy)]">
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
        <div className="pack-grid absolute inset-0 opacity-35" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Packing lists that never break hard rules — and still feel personal
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Travel product teams ship checklists that obey safety and luggage
              constraints while reflecting soft preferences. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/profiles"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-navy)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Open traveler profiles
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Compare vs prefs-only
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-tan)]">
              Rule lock · checklist reveal
            </p>
            {[
              ["Hard rule compliance", 88],
              ["Preference fit under caps", 74],
              ["Luggage feasibility", 81],
            ].map(([label, pct], i) => (
              <div
                key={String(label)}
                className="animate-checklist-reveal space-y-1"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex justify-between text-xs text-slate-500">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-slate-100">
                  <div
                    className={`h-full rounded bg-[var(--studio-navy)] ${i === 0 ? "animate-rule-lock" : ""}`}
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
          Preference-only packing lists violate safety and luggage constraints.
          Teams need hard rules first — liquids, batteries, weight caps,
          dependencies — then soft personalization that still holds the line.
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
                t: "Traveler profile workspace",
                d: "Register trips, destinations, and trip length before packing.",
              },
              {
                t: "Hard rules that lock",
                d: "Safety, luggage limits, and dependency constraints stay first-class.",
              },
              {
                t: "Soft preference capture",
                d: "Clothing, climate, and comfort prefs personalize within the envelope.",
              },
              {
                t: "Rule-compliant checklists",
                d: "Generate lists that pass hard rules, then reflect soft prefs.",
              },
              {
                t: "Optimize passes",
                d: "Lift preference fit while holding rule compliance.",
              },
              {
                t: "Honest dual compare",
                d: "Rules+prefs vs prefs-only baselines that break constraints.",
              },
            ].map((item) => (
              <li key={item.t}>
                <p className="font-medium text-slate-900">{item.t}</p>
                <p className="mt-2 text-sm text-slate-500">{item.d}</p>
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
          <li>Create a traveler profile for the trip.</li>
          <li>Attach hard rules and soft preferences.</li>
          <li>Generate a compliant checklist and run optimize passes.</li>
          <li>Compare against a prefs-only baseline that breaks rules.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-400">
          Inspired by{" "}
          <a className="underline" href={PAPER_URL}>
            arXiv:{PAPER_URL.split("/").pop()}
          </a>
          . Method-lab studio — not a live airline baggage API.
        </p>
      </section>
    </div>
  );
}
