import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-wash)] text-stone-800">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="font-[family-name:var(--font-display)] text-lg text-[var(--studio-teal)]">
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
        <div className="molecule-grid absolute inset-0 opacity-50" />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-[family-name:var(--font-display)] text-5xl leading-[1.05] tracking-tight text-[var(--studio-ink-deep)] md:text-6xl">
              {DISPLAY_NAME}
            </p>
            <h1 className="mt-6 max-w-xl text-2xl font-medium text-stone-800 md:text-3xl">
              Pocket-conditioned molecules that stay developable
            </h1>
            <p className="mt-4 max-w-lg text-lg text-stone-500">
              Register binding pockets, run pocket-conditioned generation, apply
              property-aware optimize passes, and compare against affinity-only
              baselines that fail later developability checks. {TAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/pockets"
                className="inline-flex h-9 items-center rounded-lg bg-[var(--studio-teal)] px-4 text-sm font-medium text-white hover:opacity-90"
              >
                Open pocket registry
              </Link>
              <Link
                href="/compare"
                className="inline-flex h-9 items-center rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] px-4 text-sm font-medium text-stone-800 hover:bg-white"
              >
                Compare vs affinity-only
              </Link>
            </div>
          </div>
          <div className="mt-12 max-w-xl space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--studio-coral)]">
              Pocket fit · developability meters
            </p>
            {[
              ["Pocket conditioning", 86],
              ["Developability plan", 79],
              ["Gain vs affinity-only", 88],
            ].map(([label, pct], i) => (
              <div
                key={String(label)}
                className={`animate-fade-up space-y-1 ${i === 1 ? "animate-pocket-pulse rounded-md p-1" : ""}`}
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="flex justify-between text-xs text-stone-500">
                  <span>{label}</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded bg-stone-200/80">
                  <div
                    className="animate-property-meter h-full rounded bg-[var(--studio-coral)]"
                    style={{
                      width: `${pct}%`,
                      animationDelay: `${i * 160}ms`,
                    }}
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
          Affinity-only generators look strong on pocket docking and fail
          developability later. Discovery teams need a workspace to register
          pockets, condition generation, optimize properties, and prove
          pocket+developability plans beat affinity-only baselines before
          synthesis hope.
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
                t: "Binding pocket registry",
                d: "Capture family, volume, and hydrophobicity for conditioning.",
              },
              {
                t: "Pocket-conditioned generation",
                d: "Diffusion runs that stay tied to the pocket geometry.",
              },
              {
                t: "Property-aware optimize",
                d: "QED, solubility, clearance, and synthability in one pass.",
              },
              {
                t: "Developability ledger",
                d: "Track property scores per candidate before late failure.",
              },
              {
                t: "Pocket+dev vs affinity-only",
                d: "Put developability-aware plans next to affinity baselines.",
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
          <li>Register the binding pocket you want molecules for.</li>
          <li>Run pocket-conditioned diffusion and curate candidates.</li>
          <li>
            Optimize developability properties and compare vs affinity-only.
          </li>
        </ol>
        <p className="mt-8 max-w-2xl text-sm text-stone-500">
          Soft-simulation studio inspired by pocket-conditioned developable
          molecule research — not live wet-lab synthesis. Sources:{" "}
          <a
            className="text-[var(--studio-teal)] underline-offset-2 hover:underline"
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
