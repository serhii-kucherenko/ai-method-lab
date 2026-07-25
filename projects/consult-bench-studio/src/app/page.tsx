import Link from "next/link";
import {
  CLAIM,
  DISPLAY_NAME,
  PAPER_URL,
  TAGLINE,
} from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="absolute inset-0 bg-[var(--studio-wash)]" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-mint)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-slate-100 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">
            Evaluate LLM next-responses on real consult moments where the photo
            changes the answer — not text-only chat evals.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cases"
              className="rounded-md bg-[var(--studio-mint)] px-5 py-2.5 text-sm font-medium text-[var(--studio-ink-deep)] transition hover:brightness-110"
            >
              Open consult cases
            </Link>
            <Link
              href="/honesty"
              className="rounded-md border border-slate-500 px-5 py-2.5 text-sm text-slate-200 transition hover:border-slate-300"
            >
              Honesty fence
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Text-only medical chat benchmarks miss image-dependent consult turns.
          Models that sound fluent can invent findings that are not in the photo —
          or ignore the photo entirely.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            The product
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">{CLAIM}</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              [
                "Consult case registry",
                "Register real-style consult moments by department and chief complaint.",
              ],
              [
                "Multimodal turn workspace",
                "Pair patient text with image captions and image-relevance signals.",
              ],
              [
                "Department coverage map",
                "See where your eval set is thin across dermatology, radiology, and more.",
              ],
              [
                "Next-response scoring",
                "Score the reply the patient needs — clinical plan, safety, clarity.",
              ],
              [
                "Multimodal vs text-only compare",
                "Dual score A (image-aware) vs B (text-only) makes the gap falsifiable.",
              ],
            ].map(([title, body]) => (
              <li key={title}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          How it works
        </h2>
        <ol className="mt-6 list-decimal space-y-3 pl-5 text-slate-600">
          <li>Register consult cases and department tags.</li>
          <li>Capture multimodal turns (text + image context).</li>
          <li>Score next-responses and rank models on the leaderboard.</li>
          <li>Compare multimodal-aware quality against a text-only baseline.</li>
        </ol>
      </section>

      <section className="border-t border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Honesty
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600">
            Method-lab experiment inspired by multimodal medical consult evaluation
            research. Not clinical certification and not a live hospital chat
            system.{" "}
            <Link href="/honesty" className="text-[var(--studio-mint-deep)] underline-offset-2 hover:underline">
              Full fence
            </Link>
            .
          </p>
          <p className="mt-6 text-sm text-slate-500">
            Sources:{" "}
            <a
              className="underline-offset-2 hover:underline"
              href={PAPER_URL}
              target="_blank"
              rel="noreferrer"
            >
              arXiv {PAPER_URL.split("/").pop()}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
