import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-accent)]">
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
        <div className="layer-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Chart exploration blind and low-vision users can talk through and feel
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Accessibility and data teams ship conversational + layered tactile
              presentation with a select-confirm-ask-verify loop — not visual-only
              dashboards. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/charts"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-accent)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Open chart library
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Compare vs visual-only
              </Link>
            </div>
          </div>
          <div className="animate-peel mt-12 max-w-xl [animation-delay:120ms]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--studio-sand)]">
              Layer peel · verify pulse
            </p>
            <div className="flex flex-col gap-3">
              {[
                ["Tactile layer coverage", 78],
                ["Grammar fidelity", 72],
                ["Verify discipline", 84],
              ].map(([label, pct], i) => (
                <div key={String(label)} className="space-y-1">
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{label}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-slate-100">
                    <div
                      className="animate-peel h-full rounded bg-[var(--studio-accent)]"
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
          Data charts stay locked behind visual UIs. Blind and low-vision users need
          layered tactile encodings plus conversation that confirms selections before
          answering. This studio helps teams plan that experience and compare it to a
          visual-only baseline.
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
                t: "Chart library for BLV exploration",
                d: "Register chart assets with kinds and series labels teams can explore.",
              },
              {
                t: "Layered tactile presentation",
                d: "Stack overview, axis, series, and outlier layers with texture and elevation.",
              },
              {
                t: "Feedback grammar editor",
                d: "Define spoken and haptic tokens triggered by exploration events.",
              },
              {
                t: "Select-confirm-ask-verify",
                d: "Run conversational sessions that confirm before answering.",
              },
              {
                t: "Dual compare",
                d: "Score conversational+tactile plans against a visual-only baseline.",
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
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-slate-600">
          <li>Register charts your product ships to BLV users.</li>
          <li>Configure tactile layers and feedback grammar.</li>
          <li>Run explore sessions with select → confirm → ask → verify.</li>
          <li>Compare conversational+tactile quality to visual-only.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-400">
          Inspired by{" "}
          <a className="underline" href={PAPER_URL}>
            arXiv:{PAPER_URL.split("/").pop()}
          </a>
          . Method-lab soft simulation — not live tactile hardware drivers.
        </p>
      </section>
    </div>
  );
}
