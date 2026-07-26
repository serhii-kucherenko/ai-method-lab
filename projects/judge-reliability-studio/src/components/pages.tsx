import Link from "next/link";
import { DISPLAY_NAME, TAGLINE } from "@/claim";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--studio-bg)] text-slate-100">
      <section className="mesh min-h-[72vh] px-6 py-8">
        <header className="mx-auto flex max-w-7xl justify-between">
          <span className="font-[family-name:var(--font-display)] text-xl text-teal-400">
            {DISPLAY_NAME}
          </span>
          <Link href="/honesty" className="text-sm text-slate-300">
            Honesty
          </Link>
        </header>
        <div className="mx-auto max-w-7xl pt-28">
          <p className="brand-rise font-[family-name:var(--font-display)] text-6xl tracking-tight text-teal-400 md:text-8xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-7 max-w-3xl text-3xl font-medium md:text-5xl">
            Agreement is not reliability.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Version judge packs, run item-response diagnostics, and flag unreliable items before
            a pairwise-agreement dashboard lets a flaky judge ship.
          </p>
          <div className="mt-9 flex gap-3">
            <Link
              href="/judges"
              className="rounded bg-teal-400 px-5 py-3 font-semibold text-slate-950"
            >
              Open judge packs
            </Link>
            <Link href="/demo" className="rounded border border-slate-500 px-5 py-3">
              See the walkthrough
            </Link>
          </div>
          <svg className="reliability-curve mt-12 h-16 w-64" viewBox="0 0 200 40" fill="none">
            <path
              d="M0 35 Q50 35 80 20 T160 8 T200 5"
              stroke="#14b8a6"
              strokeWidth="2"
              strokeDasharray="200"
            />
          </svg>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        {[
          ["Diagnose", "Run IRT ability, difficulty, and discrimination on judge items."],
          ["Flag", "Queue unreliable items and unstable judges before release."],
          ["Compare", "Contrast IRT reliability gates against agreement-only baselines."],
        ].map(([t, d]) => (
          <div key={t}>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-teal-400">{t}</h2>
            <p className="mt-3 text-slate-300">{d}</p>
          </div>
        ))}
      </section>
      <footer className="border-t border-slate-700 px-6 py-8 text-sm text-slate-400">
        {TAGLINE} · <Link href="/pricing">Pricing</Link> · <Link href="/flows">Flows</Link>
      </footer>
    </main>
  );
}
