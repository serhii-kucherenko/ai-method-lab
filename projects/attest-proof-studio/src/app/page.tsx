import Link from "next/link";
import { CLAIM, DISPLAY_NAME, PAPER_URL, TAGLINE } from "@/claim";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--studio-bg)] text-[var(--studio-ink)]">
      <section className="hero-fade relative overflow-hidden border-b border-[var(--studio-line)]">
        <div aria-hidden className="absolute inset-0 bg-[var(--studio-wash)]" />
        <div
          aria-hidden
          className="lattice-pulse absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,122,109,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(26,122,109,0.14) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto flex min-h-[88vh] max-w-5xl flex-col justify-end px-6 pb-16 pt-24">
          <p className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-tight text-[var(--studio-jade)] md:text-7xl">
            {DISPLAY_NAME}
          </p>
          <h1 className="mt-6 max-w-2xl font-[family-name:var(--font-display)] text-2xl text-sky-50 md:text-3xl">
            {TAGLINE}
          </h1>
          <p className="mt-4 max-w-xl text-base text-sky-100/85 md:text-lg">
            Empirical answers you can attest — not fluent fiction that invents
            evidence before you ship.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/claims"
              className="rounded-md bg-[var(--studio-jade)] px-5 py-2.5 text-sm font-medium text-[var(--studio-ink-deep)] transition hover:brightness-110"
            >
              Open claims
            </Link>
            <Link
              href="/demo"
              className="rounded-md border border-sky-400/40 px-5 py-2.5 text-sm text-sky-50 transition hover:border-sky-200"
            >
              Guided demo
            </Link>
            <Link
              href="/pricing"
              className="rounded-md border border-sky-400/40 px-5 py-2.5 text-sm text-sky-50 transition hover:border-sky-200"
            >
              Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          The problem
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Fluent LLM answers invent evidence. Trust and eval leads need empirical
          claims tied to tool calls and checkable soft-sim proof steps — before
          hallucinations ship as “verified.”
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
                "Tool-attested claim registry",
                "Register empirical claims before tools and proofs attach.",
              ],
              [
                "Soft-sim kernel proof walker",
                "Advance checkable soft-sim steps — not Lean production cert.",
              ],
              [
                "Evidence grounding ledger",
                "Cite sources and grounding scores beside attestations.",
              ],
              [
                "Attested vs fluent-only",
                "Falsify whether tool proof beats fluent confidence.",
              ],
              [
                "Honesty fence",
                "Labeled method-lab soft-sim — not EG-VAR rebrand.",
              ],
            ].map(([title, body]) => (
              <li key={title} className="plan-rise">
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
          Features
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Claims, attestations, proof chains, kernel walker, evidence ledger,
          dual scoring, compare, org settings, members, webhook, exports,
          goldens sample, and audit trail — twenty-plus capabilities behind the
          studio chrome.
        </p>
      </section>

      <section className="border-y border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            How it works
          </h2>
          <ol className="mt-6 list-decimal space-y-3 pl-5 text-slate-600">
            <li>Register an empirical claim.</li>
            <li>Attach tool attestations and ledger evidence.</li>
            <li>Walk soft-sim kernel proof steps and seal the chain.</li>
            <li>Compare attested vs fluent-only and export the trail.</li>
          </ol>
          <p className="mt-6 text-sm text-slate-600">
            New here? Use{" "}
            <Link className="underline" href="/onboarding">
              onboarding
            </Link>
            , the{" "}
            <Link className="underline" href="/demo">
              guided demo
            </Link>
            , or see{" "}
            <Link className="underline" href="/pricing">
              pricing tiers
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
          Honesty / limits
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Soft-sim proof chains for a method-lab experiment. Not production Lean
          4 certification. Not a rebrand of EG-VAR. Authors published no public
          code with the digest used here.
        </p>
      </section>

      <section className="border-t border-[var(--studio-line)] bg-[var(--studio-panel)]">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-[family-name:var(--font-display)] text-3xl text-slate-900">
            Sources
          </h2>
          <p className="mt-3 text-slate-600">
            Paper:{" "}
            <a className="underline" href={PAPER_URL}>
              {PAPER_URL}
            </a>
            {" · "}
            authors&apos; code: none published
          </p>
          <Link
            href="/claims"
            className="mt-8 inline-block rounded-md bg-[var(--studio-teal)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110"
          >
            Open claims
          </Link>
        </div>
      </section>
    </div>
  );
}
