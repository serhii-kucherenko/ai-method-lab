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
    <div className="min-h-screen bg-[var(--studio-wash)] text-stone-900">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-teal-ink)]">
          {DISPLAY_NAME}
        </span>
        <Link
          href="/honesty"
          className="text-sm text-stone-600 underline-offset-4 hover:underline"
        >
          Honesty
        </Link>
      </header>

      <section className="relative overflow-hidden border-b border-[var(--studio-line)]">
        <div className="slide-mesh absolute inset-0 opacity-90" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-teal-ink)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-stone-800 md:text-3xl">
              More than patches
            </h1>
            <p className="mt-4 max-w-lg text-lg text-stone-600">
              Manage slide cohorts, run multi-signal embedding profiles, inspect
              patch vs slide views, and compare against vision-only baselines.{" "}
              {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/cohorts">Open slide cohorts</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/embed">Start embedding</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up relative h-64 overflow-hidden rounded-lg border border-[var(--studio-line)] bg-white/75 p-4 shadow-sm [animation-delay:120ms]">
            <svg
              viewBox="0 0 320 180"
              className="animate-slide-pan h-full w-full"
              aria-hidden
            >
              <rect
                x="12"
                y="20"
                width="296"
                height="140"
                rx="6"
                className="fill-stone-100 stroke-[var(--studio-line)]"
              />
              {Array.from({ length: 6 }).map((_, row) =>
                Array.from({ length: 8 }).map((_, col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={24 + col * 34}
                    y={32 + row * 20}
                    width={28}
                    height={16}
                    rx="2"
                    className={
                      (row + col) % 3 === 0
                        ? "fill-teal-800/70"
                        : (row + col) % 3 === 1
                          ? "fill-rose-400/50"
                          : "fill-stone-300/80"
                    }
                  />
                )),
              )}
              <text
                x="24"
                y="168"
                className="fill-[var(--studio-teal-ink)] text-[11px]"
              >
                vision · language · slide
              </text>
            </svg>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-stone-600">
          Vision-only patch models miss language-aligned concepts and whole-slide
          context. Teams cannot tell when multi-signal embeddings change the
          eval outcome — or when a vision baseline is enough.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          Why teams open the studio
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {[
            [
              "Cohorts that match how slides arrive",
              "Group by organ site, stain, and case tags — not a generic job queue.",
            ],
            [
              "Multi-signal embed console",
              "Run vision + vision-language + slide-level profiles side by side with a vision-only path.",
            ],
            [
              "Inspect patches and slides",
              "See morphology, language align, and slide context contributions on the same case.",
            ],
            [
              "Transparent compare and audit",
              "Winner badges, score bars, CSV/JSON export — method-lab honesty, not a clinical claim.",
            ],
          ].map(([title, body]) => (
            <li key={title} className="border-l-2 border-[var(--studio-teal)] pl-4">
              <p className="font-medium text-stone-900">{title}</p>
              <p className="mt-1 text-stone-600">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          How it works
        </h2>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-stone-700">
          <li>Create a slide cohort for an organ site and stain protocol.</li>
          <li>Run a multi-signal or vision-only embed profile.</li>
          <li>Inspect slides and patches, then compare signals.</li>
          <li>Export the audit trail for your research notebook.</li>
        </ol>
        <p className="mt-8 text-sm text-stone-500">
          Research inspiration:{" "}
          <a className="underline" href={PAPER_URL} target="_blank" rel="noreferrer">
            arXiv {PAPER_URL.split("/").pop()}
          </a>
          {" · "}
          <a
            className="underline"
            href={AUTHORS_CODE_URL}
            target="_blank"
            rel="noreferrer"
          >
            authors&apos; code
          </a>
          . Not a clinical diagnostic product.
        </p>
      </section>
    </div>
  );
}
