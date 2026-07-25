import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="absolute inset-0 bg-[var(--studio-wash)]" />
        <div
          aria-hidden
          className="contour-pulse absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "repeating-linear-gradient(95deg, rgba(196,92,38,0.12) 0 2px, transparent 2px 52px), repeating-linear-gradient(5deg, rgba(61,90,69,0.1) 0 1px, transparent 1px 40px)",
          }}
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-ember)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <span className="ember-underline" aria-hidden />
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-stone-100 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-stone-200/90 md:text-lg">
            Physics-aware terrain refresh beats naive photo-on-DEM overlays —
            before fire season, not after.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--studio-ember)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
            >
              Open packs
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-stone-200/40 px-5 py-2.5 text-sm text-stone-100 transition hover:border-stone-100"
            >
              Guided demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-stone-200/40 px-5 py-2.5 text-sm text-stone-100 transition hover:border-stone-100"
            >
              Pricing
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-stone-200/40 px-5 py-2.5 text-sm text-stone-100 transition hover:border-stone-100"
            >
              Onboarding
            </Link>
            <Link
              href="/flows"
              className="rounded-md border border-stone-200/40 px-5 py-2.5 text-sm text-stone-100 transition hover:border-stone-100"
            >
              All flows
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-stone-600">
          Wildfire GIS teams often drape new aerials onto stale DEMs. Seams,
          slope errors, and fuel-layer drift make crews distrust refreshes — or
          trust overlays that look sharp but are geometrically wrong.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
            The product
          </h2>
          <p className="mt-3 max-w-2xl text-stone-600">{CLAIM}</p>
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {[
              [
                "Versioned terrain packs",
                "Register landscape packs with elevation span and fuel load honesty.",
              ],
              [
                "Aerial refreshes",
                "Ingest capture date, resolution, cloud cover, and overlap.",
              ],
              [
                "Alignment plans",
                "Tune control density, elevation priors, and seam budgets.",
              ],
              [
                "Physics-aware vs naive overlay",
                "Falsify whether alignment-before-trust beats photo drape.",
              ],
              [
                "Honesty fence",
                "Soft-sim only — not live dispatch or survey certification.",
              ],
            ].map(([title, body]) => (
              <li key={title}>
                <h3 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-ember)]">
                  {title}
                </h3>
                <p className="mt-1 text-stone-600">{body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-stone-900">
          How it works
        </h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-stone-600">
          <li>Register a versioned terrain pack for the landscape.</li>
          <li>Attach an aerial refresh with capture metadata.</li>
          <li>Author an alignment plan (controls, priors, seam budget).</li>
          <li>Compare physics-aware refresh (A) vs naive overlay (B).</li>
        </ol>
        <Link
          href="/demo"
          className="mt-6 inline-block text-[var(--studio-ember)] underline"
        >
          Open the step-by-step demo →
        </Link>
      </section>

      <section className="border-t border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <p className="text-stone-600">
            Seats + refresh compute packaging — see{" "}
            <Link href="/pricing" className="text-[var(--studio-ember)] underline">
              pricing tiers
            </Link>
            . Method-lab experiment; not a live checkout.
          </p>
          <p className="mt-6 text-sm text-stone-500">
            Honesty: soft-simulation only. Not LTM. Not live firefighting
            dispatch. Not survey-grade certification.{" "}
            <Link href="/honesty" className="underline">
              Full honesty page
            </Link>
            .
          </p>
          <p className="mt-4 text-sm text-stone-500">
            Sources:{" "}
            <a
              href={PAPER_URL}
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              arXiv 2607.08711v1
            </a>
            ; authors&apos; code: none published.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/packs"
              className="rounded-md bg-[var(--studio-ember)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Open packs
            </Link>
            <Link
              href="/onboarding"
              className="rounded-md border border-[var(--studio-line)] px-5 py-2.5 text-sm"
            >
              Start onboarding
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
