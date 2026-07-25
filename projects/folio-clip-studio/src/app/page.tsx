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
        <div aria-hidden className="clip-grid absolute inset-0 opacity-60" />
        <div aria-hidden className="leaf-mist absolute inset-0" />
        <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-end px-6 pb-20 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--fc-sap)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="signal-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-3xl text-white md:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-[var(--fc-mist)]">
            Clip packs with multimodal wearable sensing — compare against
            single-sensor baselines before you lock a pack.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/clips"
              className="rounded-md bg-[var(--fc-sap)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open clips
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-[var(--fc-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              See demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-[var(--fc-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--fc-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-[var(--fc-line)]/50 px-5 py-2.5 text-sm text-white"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl">
          A clip pack is more than a single ungated channel.
        </h2>
        <p className="mt-3 max-w-2xl text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          {CLAIM}
        </p>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">Clip packs</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Versioned soft-sim clip packs and sensor budgets for multimodal
              plant-stress eval.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Sensors and stress</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Make multimodal wearable configs and stress signals explicit
              before scoring.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Dual A/B</h3>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              Test multimodal wearable stress sensing against single-sensor
              baselines.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
          <li>Create a versioned clip pack for your crop target.</li>
          <li>Add multimodal sensors and plant-stress signals.</li>
          <li>Run a soft-sim and compare multimodal vs single-sensor.</li>
          <li>Lock only when deltas and honesty are understood.</li>
        </ol>
        <p className="mt-4 text-sm">
          Full walkthrough on{" "}
          <Link href="/demo" className="text-[var(--fc-sap)] underline">
            /demo
          </Link>
          . Plans on{" "}
          <Link href="/pricing" className="text-[var(--fc-sap)] underline">
            /pricing
          </Link>
          .
        </p>
      </section>
      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
          <strong className="text-[var(--studio-ink)]">Honesty fence:</strong>{" "}
          soft-sim only; not field-validated farm deployments; not live
          greenhouse write-back; not the authors&apos; system. Source:{" "}
          <a
            className="text-[var(--studio-signal)] underline"
            href={PAPER_URL}
          >
            ChemRxiv 10.26434/chemrxiv.15005167
          </a>
          . Authors&apos; code: none published.
        </div>
      </section>
    </div>
  );
}
