import Link from "next/link";
import { DISPLAY_NAME, TAGLINE } from "@/claim";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--studio-bg)] text-slate-100">
      <section className="mesh min-h-[72vh] px-6 py-8">
        <header className="mx-auto flex max-w-7xl justify-between">
          <span className="font-[family-name:var(--font-display)] text-xl text-teal-300">
            {DISPLAY_NAME}
          </span>
          <Link href="/honesty" className="text-sm text-slate-300">
            Honesty
          </Link>
        </header>
        <div className="mx-auto max-w-7xl pt-28">
          <p className="brand-rise font-[family-name:var(--font-display)] text-6xl tracking-tight text-teal-300 md:text-8xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-7 max-w-3xl text-3xl font-medium md:text-5xl">
            Hard-stop cloud spend before the invoice surprises finance.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Enforce hard account spend caps with audited overrides — instead of soft-warning while
            charges keep posting past the budget line.
          </p>
          <div className="mt-9 flex gap-3">
            <Link
              href="/accounts"
              className="rounded bg-teal-300 px-5 py-3 font-semibold text-slate-950"
            >
              Open accounts
            </Link>
            <Link href="/demo" className="rounded border border-slate-500 px-5 py-3">
              See the walkthrough
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        {[
          ["Cap", "Set hard dollar caps per account, team, and meter."],
          ["Block", "Refuse charges that would exceed the cap without an override."],
          ["Compare", "Hard-cap blocks versus soft-warn baselines."],
        ].map(([t, d]) => (
          <div key={t}>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-teal-300">{t}</h2>
            <p className="mt-3 text-slate-300">{d}</p>
          </div>
        ))}
      </section>
      <footer className="border-t border-slate-700 px-6 py-8 text-sm text-slate-400">
        {TAGLINE} · Method-lab soft-sim — not live billing write-back. ·{" "}
        <Link href="/pricing">Pricing</Link> · <Link href="/flows">Flows</Link> ·{" "}
        <Link href="/honesty">Honesty</Link>
      </footer>
    </main>
  );
}
