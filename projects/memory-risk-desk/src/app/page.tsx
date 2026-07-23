import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CohortStrip } from "@/components/cohort-strip";

const SELLING = [
  "Compare imputation-free calibrated plans against mean/mode imputation, uncalibrated, and single-cohort baselines",
  "Keep risk jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so risk scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / cohort / site profile catalog",
  "Risk job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (mean-impute / uncalibrated / single-cohort vs imputation-free calibrated)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Cohort feature-cell strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a risk job under a cohort / site profile",
  "Run scenario compare — mean/mode impute, uncalibrated, and single-cohort vs imputation-free calibrated bands",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--mrd-ink)] sm:text-4xl md:text-5xl">
            Memory Risk Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--mrd-ink)] sm:text-3xl">
            Keep missing fields — calibrate risk
          </h1>
          <p className="max-w-xl text-lg text-[var(--mrd-muted)]">
            Imputation-free plans with calibrated risk bands across heterogeneous
            cohorts — against mean/mode imputation then flat classifiers,
            uncalibrated high-confidence scores, or single-cohort-only models.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--mrd-steel)] hover:bg-[var(--mrd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <CohortStrip className="w-full max-w-xl text-[var(--mrd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mrd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--mrd-muted)] leading-relaxed">
          Alzheimer-related risk scores stall when hospitals leave different
          fields blank. Mean/mode imputation then a flat classifier overstates
          certainty; uncalibrated scores and single-cohort models ignore site
          shift across cohorts.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mrd-ink)]">
          Product
        </h2>
        <p className="text-[var(--mrd-muted)] leading-relaxed">
          Memory Risk Desk scores imputation-free calibrated plans beside naive
          imputed and uncalibrated baselines, with jobs, audit, and dual-impl
          goldens. Soft simulation — not a clinical diagnostic and not a medical
          device.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mrd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--mrd-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mrd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--mrd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mrd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-[var(--mrd-muted)]">
          {STEPS.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl border-t border-[var(--mrd-line)] pt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mrd-ink)]">
          Honesty
        </h2>
        <p className="text-[var(--mrd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a clinical diagnostic
          product and not a claim to replace the authors&apos; transformer. Never
          brand this desk as a medical device.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mrd-ink)]">
          Sources
        </h2>
        <p className="text-sm text-[var(--mrd-muted)]">
          Paper:{" "}
          <a
            className="underline underline-offset-2"
            href="https://arxiv.org/abs/2607.11656v2"
          >
            arXiv:2607.11656
          </a>
          . Authors&apos; code: none published.
        </p>
      </section>
    </div>
  );
}
