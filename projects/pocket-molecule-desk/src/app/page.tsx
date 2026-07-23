import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PocketStrip } from "@/components/pocket-strip";

const SELLING = [
  "Compare pocket-conditioned + property-aware plans against ligand-only, affinity-only, and property-blind baselines",
  "Keep molecule jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so molecule scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / pocket / target profile catalog",
  "Molecule job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (unconditioned vs pocket-property)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Pocket-fit cell strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a molecule job under a pocket / target profile (kinase, protease, gpcr, …)",
  "Run scenario compare — unconditioned / affinity-only / property-blind vs pocket-conditioned + property-aware",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--pmd-ink)] sm:text-4xl md:text-5xl">
            Pocket Molecule Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--pmd-ink)] sm:text-3xl">
            Condition the pocket — steer developability
          </h1>
          <p className="max-w-xl text-lg text-[var(--pmd-muted)]">
            Multi-scale pocket conditioning plus binding affinity and
            ADMET/developability steering — against ligand-only resemblance or
            affinity-only plans that skip developability.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--pmd-steel)] hover:bg-[var(--pmd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <PocketStrip className="w-full max-w-xl text-[var(--pmd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--pmd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--pmd-muted)] leading-relaxed">
          Unconditioned generators look fine until pocket geometry and ADMET
          properties matter. Affinity-only plans skip developability.
          Property-blind pocket fill ignores absorption, toxicity, and related
          gates that make a candidate shippable.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--pmd-ink)]">
          Product
        </h2>
        <p className="text-[var(--pmd-muted)] leading-relaxed">
          Pocket Molecule Desk scores pocket-conditioned + property-aware plans
          beside naive baselines, with jobs, audit, and dual-impl goldens. Soft
          simulation — not a docking engine or ConDitar replacement; never brand
          ConDitar / msPRL / paOPT / CDH.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--pmd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--pmd-muted)]">
          {SELLING.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--pmd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-[var(--pmd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--pmd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--pmd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl border-t border-[var(--pmd-line)] pt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--pmd-ink)]">
          Honesty
        </h2>
        <p className="text-[var(--pmd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a replacement for the
          authors&apos; ConDitar pipeline or commercial structure-based drug
          design tools. Never brand ConDitar / msPRL / paOPT / CDH as the product
          name.
        </p>
        <p className="text-sm text-[var(--pmd-muted)]">
          Paper:{" "}
          <a
            className="underline underline-offset-2"
            href="https://arxiv.org/abs/2607.12349v1"
          >
            arxiv.org/abs/2607.12349v1
          </a>
          . Authors&apos; code: none published.
        </p>
      </section>
    </div>
  );
}
