import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative min-h-screen overflow-hidden">
        <div
          aria-hidden
          className="mist-fade absolute inset-0 bg-[var(--studio-wash)]"
        />
        <div
          aria-hidden
          className="glyph-grid absolute inset-0 opacity-60"
        />
        <div
          aria-hidden
          className="stone-mist absolute inset-0"
        />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--studio-teal)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-stone-200">
            Language packs with Ge&apos;ez-script lexicon expansions — compare
            against baseline multilingual tokenizers before you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/languages"
              className="rounded-md bg-[var(--studio-teal)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open languages
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-stone-300/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-stone-300/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-stone-300/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-stone-300/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          A language pack is more than a multilingual tokenizer.
        </h2>
        <p className="mt-3 max-w-2xl text-stone-600">{CLAIM}</p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Language packs</h3>
            <p className="mt-1 text-stone-600">
              Versioned Ge&apos;ez-script families and language assumptions.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Lexicons and tokenizers</h3>
            <p className="mt-1 text-stone-600">
              Make expanded subword counts and baseline tokenizer cases explicit
              before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-stone-600">
              Test expanded Ge&apos;ez lexicons against baseline multilingual
              tokenizers.
            </p>
          </div>
        </div>
      </section>
      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-stone-600">
          <strong className="text-[var(--studio-ink)]">Honesty fence:</strong>{" "}
          method-lab soft-sim only; not production MT certification, and not the
          authors&apos; system. Source:{" "}
          <a
            className="text-[var(--studio-signal)] underline"
            href={PAPER_URL}
          >
            arXiv 2607.15209
          </a>
          .
        </div>
      </section>
    </div>
  );
}
