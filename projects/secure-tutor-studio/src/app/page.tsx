import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-stone-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-forest)]">
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
        <div className="tutor-grid absolute inset-0 opacity-70" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="animate-fade-up">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-forest)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-stone-800 md:text-3xl">
              Teach secure code with orchestrated tutors
            </h1>
            <p className="mt-4 max-w-lg text-lg text-stone-500">
              Manage courses, orchestrate multi-LLM tutor roles, run lesson
              sessions with security rubrics, and compare against a single
              unchecked model. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/courses">Open courses</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/lessons">Open lesson console</Link>
              </Button>
            </div>
          </div>
          <div className="animate-fade-up relative h-64 overflow-hidden rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5 [animation-delay:120ms]">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-[var(--studio-forest)]">
              Tutor orchestration
            </p>
            <div className="flex h-40 items-center justify-around">
              {["Explainer", "Safety", "Rubric"].map((label, i) => (
                <div
                  key={label}
                  className="animate-chip-stagger flex flex-col items-center gap-2"
                  style={{ animationDelay: `${i * 140}ms` }}
                >
                  <div className="size-14 rounded-full border-2 border-[var(--studio-forest)] bg-[var(--studio-forest-soft)]" />
                  <span className="text-xs text-stone-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-stone-500">
          A single unchecked LLM tutor can leak exploit hints, skip security
          pedagogy checks, and miss rubric gates. Secure education teams need
          orchestrated explainer, safety, and rubric roles — not one chat
          window hoping for safe answers.
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
                t: "Multi-LLM tutor orchestration",
                d: "Explainer, safety checker, and rubric grader hand off through coordination rounds.",
              },
              {
                t: "Course workspaces",
                d: "Web, API, mobile, cloud, and secure-SDLC courses with vulnerability complexity.",
              },
              {
                t: "Lesson session console",
                d: "Advance lessons through brief, teach, quiz, and rubric stages.",
              },
              {
                t: "Single-LLM compare",
                d: "Quantify orchestrated lift against an unchecked single-LLM baseline.",
              },
              {
                t: "Auditable runs",
                d: "Export CSV audits and JSON lesson runs for education reviews.",
              },
              {
                t: "Honest framing",
                d: "Inspired by multi-LLM secure tutoring research — never branded as SYNAPSE.",
              },
            ].map((s) => (
              <li key={s.t}>
                <p className="font-medium text-[var(--studio-forest)]">{s.t}</p>
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
          <li>Create a course workspace with vulnerability complexity.</li>
          <li>Assign multi-LLM tutor roles and toggle orchestration.</li>
          <li>Run a lesson session through brief → teach → quiz → rubric.</li>
          <li>Compare orchestrated vs single-LLM scores, then export audits.</li>
        </ol>
      </section>

      <footer className="border-t border-[var(--studio-line)] py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-stone-500">
          <p>
            Soft simulation for method-lab evaluation — not a live multi-LLM
            classroom product.
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
