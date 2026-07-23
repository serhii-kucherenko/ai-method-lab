import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MonitorField } from "@/components/monitor-field";

const SELLING = [
  "Compare structural monitoring against checklist scoring in one scenario",
  "Keep safety jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project catalog",
  "Safety job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (checklist vs structural)",
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
  "Open the desk and create a safety job under a project",
  "Run scenario compare — checklist baseline vs structural monitor score",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--asd-ink)] sm:text-4xl md:text-5xl">
            Agent Safety Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--asd-ink)] sm:text-3xl">
            Checklists miss the regressions that graphs catch
          </h1>
          <p className="max-w-xl text-lg text-[var(--asd-muted)]">
            See how a structural monitor score beats a naive checklist baseline
            on invariant nodes and regression signals — in a method-lab desk,
            not a commercial agent safety product.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--asd-teal)] hover:bg-[var(--asd-teal-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <MonitorField className="w-full max-w-xl text-[var(--asd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--asd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--asd-muted)] leading-relaxed">
          Agent fleets ship with flat checklists that miss structural
          regressions — broken tool boundaries, privilege drift, and invariant
          gaps that only show up when graph edges fail together. Operators need
          a monitor that scores structure, not a tick-box that always looks green.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--asd-ink)]">
          Product
        </h2>
        <p className="text-[var(--asd-muted)] leading-relaxed">
          Agent Safety Desk is an org desk that runs structural monitor scoring
          against a flat checklist baseline, with lifecycle, batch, audit, and
          goldens so the experiment stays checkable.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--asd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--asd-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--asd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--asd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--asd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-[var(--asd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--asd-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--asd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. This desk is not a
          replacement for the authors&apos; safety monitor system and not a
          commercial agent safety vendor product. Never brand it as IFG.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl" data-sources="live">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--asd-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--asd-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline text-[var(--asd-teal)]"
              href="https://arxiv.org/abs/2607.14570v1"
            >
              https://arxiv.org/abs/2607.14570v1
            </a>
          </li>
          <li>Authors&apos; code: none published with this paper</li>
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl pb-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--asd-ink)]">
          Ready to try the desk?
        </h2>
        <Button
          asChild
          className="bg-[var(--asd-teal)] hover:bg-[var(--asd-teal-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
