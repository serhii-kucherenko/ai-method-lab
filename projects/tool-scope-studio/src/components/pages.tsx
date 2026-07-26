import Link from "next/link";
import { DISPLAY_NAME, TAGLINE } from "@/claim";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--studio-bg)] text-slate-100">
      <section className="mesh min-h-[72vh] px-6 py-8">
        <header className="mx-auto flex max-w-7xl justify-between">
          <span className="font-[family-name:var(--font-display)] text-xl text-rose-400">
            {DISPLAY_NAME}
          </span>
          <Link href="/honesty" className="text-sm text-slate-300">
            Honesty
          </Link>
        </header>
        <div className="mx-auto max-w-7xl pt-28">
          <p className="brand-rise font-[family-name:var(--font-display)] text-6xl tracking-tight text-rose-400 md:text-8xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-7 max-w-3xl text-3xl font-medium md:text-5xl">
            Grant only the tools the agent was scoped for.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-300">
            Bound agent tool calls to declared capability scopes — instead of open-tool runtimes that
            grant shell, network, and write access by default.
          </p>
          <div className="mt-9 flex gap-3">
            <Link
              href="/fleets"
              className="rounded bg-rose-400 px-5 py-3 font-semibold text-slate-950"
            >
              Open fleets
            </Link>
            <Link href="/demo" className="rounded border border-slate-500 px-5 py-3">
              See the walkthrough
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        {[
          ["Scope", "Declare capability packs each agent is allowed to touch."],
          ["Grant", "Approve in-scope calls and deny sensitive out-of-scope tools."],
          ["Compare", "Scope-bound grants versus open-tools baselines."],
        ].map(([t, d]) => (
          <div key={t}>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-rose-400">{t}</h2>
            <p className="mt-3 text-slate-300">{d}</p>
          </div>
        ))}
      </section>
      <footer className="border-t border-slate-700 px-6 py-8 text-sm text-slate-400">
        {TAGLINE} · Method-lab soft-sim — not live agent runtime write-back. ·{" "}
        <Link href="/pricing">Pricing</Link> · <Link href="/flows">Flows</Link> ·{" "}
        <Link href="/honesty">Honesty</Link>
      </footer>
    </main>
  );
}
