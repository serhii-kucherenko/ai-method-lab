import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-slate-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-green)]">
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
        <div className="care-grid absolute inset-0 opacity-35" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Evidence-grounded MSK decisions from admission through rehab
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-500">
              Care teams link hospital state streams and medical knowledge so
              every plan stays tied to the patient&apos;s evolving state.{" "}
              {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/episodes"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-green)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Open care episodes
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                Compare vs ungrounded LLM
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-slate)]">
              Stream tick · pathway progress
            </p>
            {[
              ["Stream coverage", 86],
              ["Knowledge grounding", 78],
              ["Pathway progress", 62],
            ].map(([label, pct], i) => (
              <div
                key={String(label)}
                className="animate-fade-up space-y-1"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex justify-between text-xs text-slate-500">
                  <span className={i === 0 ? "animate-stream-tick" : ""}>
                    {label}
                  </span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-slate-100">
                  <div
                    className="h-full rounded bg-[var(--studio-green)] animate-pathway-progress"
                    style={{
                      ["--pathway-w" as string]: `${pct}%`,
                      width: `${pct}%`,
                    }}
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
          MSK decisions often float free of hospital state and external
          evidence. Ungrounded LLM suggestions skip streams and guidelines —
          teams need grounded plans across admission → rehab.
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
                t: "Episode workspace",
                d: "Register patient care episodes from admission through discharge.",
              },
              {
                t: "State stream linking",
                d: "Attach vitals, imaging, notes, and therapy streams to each episode.",
              },
              {
                t: "Evidence ledger",
                d: "Log decisions with stream + knowledge grounding scores.",
              },
              {
                t: "Admission → rehab pathways",
                d: "Track pathway progress and rehab readiness as care evolves.",
              },
              {
                t: "Grounded vs ungrounded",
                d: "Compare evidence-grounded plans against an ungrounded LLM baseline.",
              },
            ].map((s) => (
              <li key={s.t}>
                <p className="font-semibold text-slate-900">{s.t}</p>
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
          <li>Open a care episode and set stage (admission → rehab).</li>
          <li>Link hospital state streams and external knowledge sources.</li>
          <li>Record grounded decisions and advance the pathway.</li>
          <li>Run compare to see the gap vs an ungrounded LLM baseline.</li>
        </ol>
      </section>

      <footer className="border-t border-[var(--studio-line)] bg-white/60 py-10">
        <div className="mx-auto max-w-6xl space-y-3 px-4 text-sm text-slate-500">
          <p>
            Method-lab experiment inspired by{" "}
            <a className="underline" href={PAPER_URL}>
              arXiv:{PAPER_URL.split("/").pop()}
            </a>
            . Not clinical certification. Not a live EHR. Not OrthoPilot.
          </p>
          <p>
            Sources: {PAPER_URL} · Authors’ code: none ·{" "}
            <Link href="/honesty" className="underline">
              Honesty fence
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
