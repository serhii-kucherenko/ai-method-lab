import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RouteField } from "@/components/route-field";

const SELLING = [
  "Compare screened random-effects pooling against naive averages that skip eligibility",
  "Keep synthesis jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so effect-size scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / topic catalog",
  "Synthesis job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (naive average / fixed-effect-all / unweighted vs screened RE)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
];

const STEPS = [
  "Open the desk and create a synthesis job under a review topic",
  "Run scenario compare — naive averages include ineligible rows; screened path uses Hedges' g + random-effects",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--esd-ink)] sm:text-4xl md:text-5xl">
            Evidence Synthesis Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--esd-ink)] sm:text-3xl">
            Screen first; then pool with care
          </h1>
          <p className="max-w-xl text-lg text-[var(--esd-muted)]">
            Score screened eligibility, standardized effect sizes, and
            random-effects pooling against naive averages that skip screening
            discipline.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--esd-steel)] hover:bg-[var(--esd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <RouteField className="w-full max-w-xl text-[var(--esd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--esd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--esd-muted)] leading-relaxed">
          Averaging reported numbers without eligibility lets underpowered or
          off-protocol studies drag the pooled answer. Teams need a desk that
          screens, standardizes, and pools with heterogeneity visible — not a
          single glowing mean.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--esd-ink)]">
          Product
        </h2>
        <p className="text-[var(--esd-muted)] leading-relaxed">
          Evidence Synthesis Desk runs a screened pipeline — eligibility →
          Hedges&apos; g → DerSimonian–Laird random-effects — beside naive
          averages and other weak baselines, with jobs, audit, and goldens.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--esd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--esd-muted)]">
          {SELLING.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--esd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-[var(--esd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--esd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--esd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--esd-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--esd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a replacement for the
          authors&apos; system. Not a commercial evidence-synthesis vendor. Never
          brand as AutoSynthesis.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--esd-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--esd-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline"
              href="https://arxiv.org/abs/2607.15247v1"
            >
              https://arxiv.org/abs/2607.15247v1
            </a>
          </li>
          <li>Authors&apos; code: none published</li>
        </ul>
      </section>

      <section className="pt-4">
        <Button
          asChild
          className="bg-[var(--esd-steel)] hover:bg-[var(--esd-steel-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
