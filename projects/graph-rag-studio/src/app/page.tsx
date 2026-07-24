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
        <div className="graph-pattern absolute inset-0 opacity-60" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-teal-ink)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-slate-800 md:text-3xl">
              See every hop behind the answer
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">
              Build GraphRAG pipelines that extract, consolidate, and retrieve
              with visible graph evidence. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/corpora">Open corpora</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/ask">Try ask playground</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up relative h-64 rounded-lg border border-[var(--studio-line)] bg-white/70 p-6 shadow-sm [animation-delay:120ms]">
            <svg viewBox="0 0 320 180" className="h-full w-full" aria-hidden>
              <circle cx="48" cy="90" r="14" className="fill-teal-700" />
              <circle cx="160" cy="48" r="14" className="fill-teal-600" />
              <circle cx="160" cy="132" r="14" className="fill-slate-500" />
              <circle cx="272" cy="90" r="14" className="fill-teal-800" />
              <path
                d="M62 90 L146 55"
                className="animate-trail stroke-teal-600"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M174 55 L258 90"
                className="animate-trail stroke-teal-700 [animation-delay:200ms]"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M174 125 L258 95"
                className="animate-trail stroke-slate-400 [animation-delay:350ms]"
                strokeWidth="2"
                fill="none"
              />
              <text x="30" y="120" className="fill-slate-600 text-[10px]">
                extract
              </text>
              <text x="140" y="28" className="fill-slate-600 text-[10px]">
                consolidate
              </text>
              <text x="250" y="120" className="fill-slate-600 text-[10px]">
                answer
              </text>
            </svg>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Why teams open the studio
        </h2>
        <p className="mt-2 max-w-2xl text-slate-600">
          Single-pass graph builds leave duplicate entities and weak edges.
          Operators cannot see why a retrieval answer was chosen.
        </p>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            [
              "Multi-step construction",
              "Extract mentions, then consolidate with dedupe and summarize before retrieval.",
            ],
            [
              "Hop trails",
              "Every ask session shows the entity path and citations behind the answer.",
            ],
            [
              "Compact or heavy profile",
              "Tune construction depth for refresh cost vs. coverage.",
            ],
            [
              "Scenario proof",
              "Compare multi-step quality against a single-shot noisy baseline.",
            ],
            [
              "Auditable runs",
              "Pipeline stage history and CSV export for review.",
            ],
          ].map(([title, body]) => (
            <li key={title} className="border-t border-[var(--studio-line)] pt-4">
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="mt-2 text-slate-600">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-white/60">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["1. Corpus", "Create a project and attach document counts for a domain."],
              [
                "2. Pipeline",
                "Advance extract → consolidate → ready; illegal skips are rejected.",
              ],
              [
                "3. Ask",
                "Query the graph and inspect hop trails, then export the trail JSON.",
              ],
            ].map(([t, b]) => (
              <li key={t}>
                <h3 className="font-semibold text-[var(--studio-teal-ink)]">{t}</h3>
                <p className="mt-2 text-slate-600">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          Features in this release
        </h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          Corpora, multi-step pipelines, graph explorer with hop highlight, ask
          playground, scenario compare, run audit + CSV, org members, HMAC
          webhooks, construction profiles, dual-impl goldens panel, and an
          honesty fence with paper Sources.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link href="/corpora">Start with a corpus</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-[var(--studio-line)] bg-slate-50">
        <div className="mx-auto max-w-6xl space-y-3 px-4 py-10 text-sm text-slate-600">
          <p>
            <strong className="text-slate-800">Honesty:</strong> Method Lab
            experiment inspired by RAGU multi-step GraphRAG research. Not a
            productization of RAGU or Meno-Lite.
          </p>
          <p>
            Sources:{" "}
            <a className="text-[var(--studio-teal-ink)] underline" href={PAPER_URL}>
              arXiv {PAPER_URL}
            </a>
            {" · "}
            <a
              className="text-[var(--studio-teal-ink)] underline"
              href={AUTHORS_CODE_URL}
            >
              Authors’ code
            </a>
          </p>
          <p>
            <Link href="/honesty" className="underline">
              Full honesty page
            </Link>
            {" · "}
            <Link href="/settings" className="underline">
              Settings
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
