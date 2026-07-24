import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-stone-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-amber)]">
          {DISPLAY_NAME}
        </span>
        <Link
          href="/honesty"
          className="text-sm text-stone-500 underline-offset-4 hover:underline"
        >
          Honesty
        </Link>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--studio-line)]">
        <div className="safety-grid absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-charcoal)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-stone-800 md:text-3xl">
              Catch regressions before they ship
            </h1>
            <p className="mt-4 max-w-lg text-lg text-stone-500">
              Manage agent fleets, configure structural monitors, review
              regression alerts, and compare against unchecked /
              threshold-only baselines. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/fleets">Open fleets</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/alerts">Open alert console</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up relative h-64 overflow-hidden rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5 [animation-delay:120ms]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--studio-amber)]">
              Structural delta
            </p>
            <div className="flex h-40 flex-col justify-center gap-3">
              {["CFG delta", "DFG delta", "Privilege broaden"].map(
                (label, i) => (
                  <div key={label} className="space-y-1">
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>{label}</span>
                      <span>{70 - i * 12}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded bg-stone-100">
                      <div
                        className="animate-bar-grow h-full rounded bg-[var(--studio-amber)]"
                        style={{
                          width: `${70 - i * 12}%`,
                          animationDelay: `${i * 120}ms`,
                        }}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-stone-500">
          Coding agents can finish the visible task while quietly weakening
          infrastructure safeguards — broader permissions, weaker logging, new
          persistence paths. Hope-and-check after merge is not a monitor.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-white/70 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Structural monitors",
                d: "CFG and DFG security deltas catch posture regressions raw diffs miss.",
              },
              {
                t: "Agent fleets",
                d: "Group IaC, coding, and ops agents with risk pressure and notes.",
              },
              {
                t: "Alert console",
                d: "Review suspicion scores, ack regressions, and resolve before ship.",
              },
              {
                t: "Threshold compare",
                d: "Quantify structural lift against unchecked / threshold-only baselines.",
              },
              {
                t: "Sync or async",
                d: "Block pre-merge or review post-hoc with the same monitor roster.",
              },
              {
                t: "Honest framing",
                d: "Inspired by structural monitoring research — never branded as IFG.",
              },
            ].map((s) => (
              <li key={s.t}>
                <p className="font-medium text-[var(--studio-amber)]">{s.t}</p>
                <p className="mt-2 text-sm text-stone-500">{s.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          How it works
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-stone-500">
          <li>Create an agent deployment fleet with risk pressure.</li>
          <li>Configure structural monitors (CFG, DFG, privilege, deny-guard).</li>
          <li>Review regression alerts and advance ack → resolve.</li>
          <li>Compare structural vs threshold scores, then export audits.</li>
        </ol>
      </section>

      <footer className="border-t border-[var(--studio-line)] py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-stone-500">
          <p>
            Soft simulation for method-lab evaluation — not a live agent
            control plane or IFG product.
          </p>
          <a
            href={PAPER_URL}
            className="underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Research source
          </a>
        </div>
      </footer>
    </div>
  );
}
