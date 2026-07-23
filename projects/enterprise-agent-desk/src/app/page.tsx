import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlanField } from "@/components/plan-field";

const SELLING = [
  "Compare multi-agent ERP coordination against a single-agent baseline in one scenario",
  "Keep plan jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project catalog",
  "Plan job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (single-agent vs multi-agent)",
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
  "Open the desk and create a plan job under a project",
  "Run scenario compare — single-agent baseline vs multi-agent coordinator score",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--ead-ink)] sm:text-4xl md:text-5xl">
            Enterprise Agent Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--ead-ink)] sm:text-3xl">
            One agent stalls where five roles coordinate
          </h1>
          <p className="max-w-xl text-lg text-[var(--ead-muted)]">
            See how a multi-agent coordinator score beats a single-agent baseline
            on role-aligned agents and workflow functions — in a method-lab desk,
            not a commercial ERP automation product.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--ead-teal)] hover:bg-[var(--ead-teal-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <PlanField className="w-full max-w-xl text-[var(--ead-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ead-ink)]">
          Problem
        </h2>
        <p className="text-[var(--ead-muted)] leading-relaxed">
          ERP systems record transactions well but still leave cross-functional
          planning to one overloaded operator or a rigid rule bot. Sales commits
          stock that purchasing never ordered; finance sees the loss after the
          fact. Teams need a desk that scores role-aligned coordination, not a
          single-agent script that always looks busy.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ead-ink)]">
          Product
        </h2>
        <p className="text-[var(--ead-muted)] leading-relaxed">
          Enterprise Agent Desk is an org desk that runs multi-agent coordinator
          scoring against a flat single-agent baseline, with lifecycle, batch,
          audit, and goldens so the experiment stays checkable.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ead-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--ead-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ead-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--ead-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ead-ink)]">
          How it works
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-[var(--ead-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ead-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--ead-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. This desk is not a
          replacement for the authors&apos; Agentic ERP system and not a
          commercial ERP automation product. Never brand it as Agentic ERP.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl" data-sources="live">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ead-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--ead-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline text-[var(--ead-teal)]"
              href="https://arxiv.org/abs/2607.17331v1"
            >
              https://arxiv.org/abs/2607.17331v1
            </a>
          </li>
          <li>Authors&apos; code: none published with this paper</li>
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl pb-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ead-ink)]">
          Ready to try the desk?
        </h2>
        <Button
          asChild
          className="bg-[var(--ead-teal)] hover:bg-[var(--ead-teal-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
