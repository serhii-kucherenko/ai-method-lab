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
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-mint-ink)]">
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
        <div className="helix-pattern absolute inset-0 opacity-80" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-mint-ink)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Structure and evolution in the score
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              Manage organism panels, run feature-integrated virulence
              predictions, inspect contributions, and compare against
              sequence-only baselines. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/panels">Open organism panels</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/predict">Start predicting</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up relative h-64 rounded-lg border border-[var(--studio-line)] bg-white/75 p-6 shadow-sm [animation-delay:120ms]">
            <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
              <rect
                x="20"
                y="40"
                width="48"
                height="100"
                className="animate-bar-grow fill-teal-800/80"
                rx="4"
              />
              <rect
                x="84"
                y="60"
                width="48"
                height="80"
                className="animate-bar-grow fill-teal-600/70 [animation-delay:100ms]"
                rx="4"
              />
              <rect
                x="148"
                y="28"
                width="48"
                height="112"
                className="animate-bar-grow fill-teal-700/85 [animation-delay:200ms]"
                rx="4"
              />
              <rect
                x="212"
                y="72"
                width="48"
                height="68"
                className="animate-bar-grow fill-slate-500/60 [animation-delay:300ms]"
                rx="4"
              />
              <text x="24" y="160" className="fill-slate-600 text-[9px]">
                seq
              </text>
              <text x="90" y="160" className="fill-slate-600 text-[9px]">
                PSSM
              </text>
              <text x="154" y="160" className="fill-slate-600 text-[9px]">
                MSA
              </text>
              <text x="214" y="160" className="fill-slate-600 text-[9px]">
                struct
              </text>
              <text x="268" y="50" className="fill-[var(--studio-mint-ink)] text-[11px]">
                VF / ARG
              </text>
            </svg>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Sequence-only virulence screens miss evolutionary and structural
          signal. Teams cannot tell whether a fast baseline is good enough — or
          when PSSM, MSA, and structure features change the call.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Why teams open the studio
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            [
              "Structural + evolutionary integration",
              "PSSM, MSA depth, and contact maps join sequence descriptors in one score.",
            ],
            [
              "Organism / sample panels",
              "Group isolates and accessions before you predict.",
            ],
            [
              "Feature contribution views",
              "See how statistical, PSSM, MSA, and structure channels drive the call.",
            ],
            [
              "Integrated vs sequence-only compare",
              "Side-by-side dual scores so structure/evolution is measurable.",
            ],
            [
              "Auditable prediction runs",
              "Stage history, JSON export, and CSV audit trail.",
            ],
            [
              "Research honesty fence",
              "Not a clinical diagnostic — Sources and limits on /honesty.",
            ],
          ].map(([title, body]) => (
            <li key={title}>
              <h3 className="font-medium text-slate-900">{title}</h3>
              <p className="mt-1 text-slate-600">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-slate-700">
          <li>Create an organism panel for your samples.</li>
          <li>Run feature-integrated or sequence-only prediction.</li>
          <li>Inspect feature bars, then compare modes on /compare.</li>
          <li>Export runs and audits when you need a paper trail.</li>
        </ol>
        <p className="mt-8 text-sm text-slate-500">
          Research method inspired by public virulence / ARG prediction work —{" "}
          <a className="underline" href={PAPER_URL}>
            paper
          </a>
          ,{" "}
          <a className="underline" href={AUTHORS_CODE_URL}>
            authors&apos; code
          </a>
          . Not branded as their tool.
        </p>
      </section>
    </div>
  );
}
