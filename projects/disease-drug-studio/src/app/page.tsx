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
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-teal-ink)]">
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
        <div className="molecule-pattern absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-teal-ink)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              Candidates that know the disease
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              Run disease-conditioned generation, rank candidates, and compare
              against disease-blind baselines in one studio. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/programs">Open disease programs</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/generate">Start generating</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up relative h-64 rounded-lg border border-[var(--studio-line)] bg-white/75 p-6 shadow-sm [animation-delay:120ms]">
            <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
              <circle cx="56" cy="96" r="18" className="fill-teal-800" />
              <circle cx="140" cy="48" r="12" className="fill-teal-600" />
              <circle cx="140" cy="144" r="12" className="fill-slate-500" />
              <circle cx="230" cy="96" r="16" className="fill-teal-700" />
              <circle cx="290" cy="70" r="10" className="fill-teal-500" />
              <path
                d="M74 90 L128 55"
                className="animate-bar-draw stroke-teal-700"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M152 55 L216 90"
                className="animate-bar-draw stroke-teal-600 [animation-delay:150ms]"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M152 140 L216 105"
                className="animate-bar-draw stroke-slate-400 [animation-delay:280ms]"
                strokeWidth="2"
                fill="none"
              />
              <text x="28" y="130" className="fill-slate-600 text-[10px]">
                disease
              </text>
              <text x="118" y="28" className="fill-slate-600 text-[10px]">
                target
              </text>
              <text x="250" y="120" className="fill-slate-600 text-[10px]">
                candidates
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
          Generic molecule generators condition on targets or properties and
          ignore disease context. Teams cannot see whether disease-aware runs
          actually beat disease-blind baselines.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Why teams open the studio
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            [
              "Disease-conditioned profiles",
              "MeSH ontology depth and conditioning strength shape generation quality.",
            ],
            [
              "Candidate library",
              "Rank, filter, and export SMILES with validity, affinity, and disease fit.",
            ],
            [
              "Aware vs blind compare",
              "Side-by-side dual scores so disease context is measurable, not assumed.",
            ],
            [
              "Program workspaces",
              "One indication, target, and MeSH tag set per disease program.",
            ],
            [
              "Auditable runs",
              "Stage history from conditioning through ranking, with CSV export.",
            ],
          ].map(([title, body]) => (
            <li key={title} className="border-t border-[var(--studio-line)] pt-4">
              <h3 className="font-medium text-slate-900">{title}</h3>
              <p className="mt-1 text-slate-600">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-white/50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Features
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Programs, generate console, library filters, compare, runs audit,
            org settings, webhook HMAC, honesty fence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/programs">Programs</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/library">Library</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/compare">Compare</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-slate-700">
          <li>Create a disease program with indication, MeSH tags, and target.</li>
          <li>Generate with disease-aware conditioning (or blind baseline).</li>
          <li>Advance stages, rank candidates into the library, compare scores.</li>
          <li>Export audits and candidates; configure webhook + members.</li>
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
          Honesty
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Method Lab experiment with soft-simulated scores for learning — not
          clinical advice, not a branded port of authors&apos; weights. See{" "}
          <Link href="/honesty" className="underline underline-offset-4">
            /honesty
          </Link>
          .
        </p>
        <p className="mt-6 text-sm text-slate-500">
          Sources:{" "}
          <a
            href={PAPER_URL}
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            arXiv paper
          </a>
          {" · "}
          <a
            href={AUTHORS_CODE_URL}
            className="underline underline-offset-4"
            target="_blank"
            rel="noreferrer"
          >
            authors&apos; code
          </a>
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <Link href="/programs">Enter Disease Drug Studio</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
