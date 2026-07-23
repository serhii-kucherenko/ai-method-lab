import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PathwayStrip } from "@/components/pathway-strip";

const SELLING = [
  "Compare dual-evidence plans against parametric-memory-only, hospital-only, and external-only baselines",
  "Keep pathway jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so pathway scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / indication / pathway profile catalog",
  "Pathway job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (naive parametric vs dual-evidence pathway)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Missing-evidence acquisition strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a pathway job under an indication profile (tka, tha, acl, spine, …)",
  "Run scenario compare — naive parametric / single-world vs dual-evidence stage-aware plan",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--jcd-ink)] sm:text-4xl md:text-5xl">
            Joint Care Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--jcd-ink)] sm:text-3xl">
            Ground both worlds — stage the pathway
          </h1>
          <p className="max-w-xl text-lg text-[var(--jcd-muted)]">
            In-hospital evidence plus external knowledge and stage-aware care —
            against parametric-memory-only or single-world plans that miss
            admission through rehab.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--jcd-steel)] hover:bg-[var(--jcd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <PathwayStrip className="w-full max-w-xl text-[var(--jcd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--jcd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--jcd-muted)] leading-relaxed">
          Parametric single-shot answers look fine until missing hospital charts
          or external guidelines matter. Hospital-only or external-only plans miss
          the other world. Stage-blind advice ignores admission → peri-op →
          discharge → rehab transitions.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--jcd-ink)]">
          Product
        </h2>
        <p className="text-[var(--jcd-muted)] leading-relaxed">
          Joint Care Desk scores dual-evidence pathway plans beside naive
          baselines, with jobs, audit, and dual-impl goldens. Soft simulation —
          not a clinical EHR or OrthoPilot replacement; never brand OrthoPilot /
          CHEESE / OrthoBench / ORACLE.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--jcd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--jcd-muted)]">
          {SELLING.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--jcd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-[var(--jcd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--jcd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--jcd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--jcd-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--jcd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a replacement for the
          authors&apos; OrthoPilot system or commercial clinical AI vendors. Soft
          simulation only. Never brand OrthoPilot / CHEESE / OrthoBench / ORACLE
          as the product name.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--jcd-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--jcd-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline"
              href="https://arxiv.org/abs/2607.12527v2"
            >
              https://arxiv.org/abs/2607.12527v2
            </a>
          </li>
          <li>Authors&apos; code: none published</li>
        </ul>
      </section>

      <section className="pt-4">
        <Button
          asChild
          className="bg-[var(--jcd-steel)] hover:bg-[var(--jcd-steel-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
