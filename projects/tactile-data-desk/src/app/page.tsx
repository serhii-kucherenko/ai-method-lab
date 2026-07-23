import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RouteField } from "@/components/route-field";

const SELLING = [
  "Compare grounded select → confirm → ask → verify against speech-only answers that skip tactile grounding",
  "Keep tactile explore jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so grounding scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / chart topic catalog",
  "Tactile explore job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (speech-only / select-skip-confirm / agent-no-verify vs grounded)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Soft RTD layer strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a tactile explore job under a chart topic",
  "Run scenario compare — speech-only invents answers; grounded path selects, confirms, asks the agent, then verifies on the chart",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--tdd-ink)] sm:text-4xl md:text-5xl">
            Tactile Data Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--tdd-ink)] sm:text-3xl">
            Select, confirm, ask — then verify on the chart
          </h1>
          <p className="max-w-xl text-lg text-[var(--tdd-muted)]">
            Score soft layered selection, confirmation, agent calculation, and
            chart verification against speech-only answers that skip tactile
            grounding.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--tdd-steel)] hover:bg-[var(--tdd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <RouteField className="w-full max-w-xl text-[var(--tdd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tdd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--tdd-muted)] leading-relaxed">
          Speech-only chart answers invent numbers without a tactile select and
          confirm. Teams need a desk that grounds on soft layers, reserves the
          agent for calculation, then verifies on the chart — not a floating
          voice reply.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tdd-ink)]">
          Product
        </h2>
        <p className="text-[var(--tdd-muted)] leading-relaxed">
          Tactile Data Desk runs a grounded pipeline — select → confirm → ask
          agent → verify on chart — beside speech-only and other weak baselines,
          with jobs, audit, and goldens. Soft RTD layer simulation; no hardware
          required.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tdd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--tdd-muted)]">
          {SELLING.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tdd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-[var(--tdd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tdd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--tdd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tdd-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--tdd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a replacement for the
          authors&apos; system. Not a commercial tactile accessibility product.
          Never brand as Feelogue, CTDI, or Dot Pad.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--tdd-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--tdd-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline"
              href="https://arxiv.org/abs/2607.14588v1"
            >
              https://arxiv.org/abs/2607.14588v1
            </a>
          </li>
          <li>
            Authors&apos; code:{" "}
            <a
              className="underline"
              href="https://github.com/accessible-data-vis/feelogue"
            >
              https://github.com/accessible-data-vis/feelogue
            </a>
          </li>
        </ul>
      </section>

      <section className="pt-4">
        <Button
          asChild
          className="bg-[var(--tdd-steel)] hover:bg-[var(--tdd-steel-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
