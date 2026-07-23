import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CenterStrip } from "@/components/center-strip";

const SELLING = [
  "Compare unified segmentation+phenotyping plans against segmentation-only, phenotype-from-raw-pixels-only, and single-center baselines",
  "Keep scan pathway jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so pathway scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / center / site profile catalog",
  "Scan job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (seg-only / pheno_pixels / single-center vs unified segmentation+phenotyping)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Structure+phenotype pathway strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a scan job under a center / site profile",
  "Run scenario compare — segmentation-only, pheno_pixels, and single-center vs unified segmentation+phenotyping bands",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--hsd-ink)] sm:text-4xl md:text-5xl">
            Heart Scan Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--hsd-ink)] sm:text-3xl">
            Segment structure — phenotype together
          </h1>
          <p className="max-w-xl text-lg text-[var(--hsd-muted)]">
            Unified cardiac CT segmentation+phenotyping plans with phenotype linked
            to structure across multicenter sites — against segmentation-only,
            phenotype-from-raw-pixels-only, or single-center unchecked baselines.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--hsd-steel)] hover:bg-[var(--hsd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <CenterStrip className="w-full max-w-xl text-[var(--hsd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--hsd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--hsd-muted)] leading-relaxed">
          Cardiac CT pathways stall when structure outlines and clinical
          phenotypes are run in isolation, or only checked at one hospital.
          Segmentation-only plans miss phenotype; pixel-only phenotype skips
          structure; single-center unchecked models ignore multicenter shift.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--hsd-ink)]">
          Product
        </h2>
        <p className="text-[var(--hsd-muted)] leading-relaxed">
          Heart Scan Desk scores unified segmentation+phenotyping plans beside
          naive segmentation-only and phenotype-from-pixels baselines, with jobs,
          audit, and dual-impl goldens. Soft simulation — not a clinical
          diagnostic and not a medical device.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--hsd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--hsd-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--hsd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--hsd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--hsd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal space-y-2 pl-5 text-[var(--hsd-muted)]">
          {STEPS.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl border-t border-[var(--hsd-line)] pt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--hsd-ink)]">
          Honesty
        </h2>
        <p className="text-[var(--hsd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a clinical diagnostic
          product and not a claim to replace the authors&apos; foundation model.
          Never brand this desk as a medical device.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--hsd-ink)]">
          Sources
        </h2>
        <p className="text-sm text-[var(--hsd-muted)]">
          Paper:{" "}
          <a
            className="underline underline-offset-2"
            href="https://arxiv.org/abs/2607.11287v1"
          >
            arXiv:2607.11287
          </a>
          . Authors&apos; code: none published.
        </p>
      </section>
    </div>
  );
}
