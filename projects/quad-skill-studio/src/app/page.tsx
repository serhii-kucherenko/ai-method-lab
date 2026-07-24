import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-stone-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-signal-ink)]">
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
        <div className="trail-grid absolute inset-0 opacity-40 animate-terrain-scrub" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-stone-800 md:text-3xl">
              Multi-skill locomotion for wild terrain
            </h1>
            <p className="mt-4 max-w-lg text-lg text-stone-500">
              Register robots, map trails, curate gaits, and compare smooth
              skill switches against single-gait policies that stall when the
              ground changes. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/robots"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-signal)] px-4 text-sm font-medium text-[var(--studio-signal-ink)] hover:opacity-90"
              >
                Open robot registry
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 text-sm font-medium text-stone-800 hover:bg-white"
              >
                Compare vs single-gait
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-earth)]">
              Gait switch · trail readiness
            </p>
            {[
              ["Transition smoothness", 88],
              ["Skill coverage", 78],
              ["Stall avoided vs single-gait", 91],
            ].map(([label, pct], i) => (
              <div
                key={String(label)}
                className={`animate-fade-up space-y-1 ${i === 1 ? "animate-gait-morph rounded-md p-1" : ""}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex justify-between text-xs text-stone-500">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-stone-200/80">
                  <div
                    className="h-full rounded bg-[var(--studio-signal)]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-stone-500">
          Single-gait policies work on the training pad and stall in the wild.
          Teams need a workspace to register robots, map terrains, curate motor
          skills, review gait transitions, and prove multi-skill plans beat
          single-gait baselines before field hope.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]/80 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
            Selling points
          </h2>
          <ul className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                t: "Robot + terrain workspace",
                d: "Register quadrupeds and the wild maps they must cross.",
              },
              {
                t: "Multi-skill motor library",
                d: "Trot, crawl, climb, and more — coverage and stability in one place.",
              },
              {
                t: "Trajectory / RL curator",
                d: "Track training packs that feed perceptive multi-skill plans.",
              },
              {
                t: "Gait transition review",
                d: "Score smoothness when the terrain demands a skill switch.",
              },
              {
                t: "Multi-skill vs single-gait",
                d: "Put stall-prone baselines next to smooth transition plans.",
              },
            ].map((item) => (
              <li key={item.t}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
                  {item.t}
                </h3>
                <p className="mt-2 text-stone-500">{item.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          How it works
        </h2>
        <ol className="mt-6 max-w-2xl list-decimal space-y-3 pl-5 text-stone-600">
          <li>Register the quadruped you train for wild trails.</li>
          <li>Map terrains and curate motor skills with coverage scores.</li>
          <li>Review gait transitions and compare multi-skill vs single-gait.</li>
        </ol>
        <p className="mt-8 max-w-2xl text-sm text-stone-500">
          Soft-simulation studio inspired by multi-skill perceptive locomotion
          research — not live robot control. Sources:{" "}
          <a
            className="text-[var(--studio-earth)] underline-offset-2 hover:underline"
            href={PAPER_URL}
            target="_blank"
            rel="noreferrer"
          >
            {PAPER_URL}
          </a>
        </p>
      </section>
    </div>
  );
}
