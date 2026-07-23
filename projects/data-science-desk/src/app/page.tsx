import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WorldField } from "@/components/world-field";

const SELLING = [
  "Compare world-model guided routing against a naive step-burn baseline in one scenario",
  "Keep agent jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so efficiency scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project catalog",
  "Agent job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (naive step-burn vs world-model guided)",
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
  "Open the desk and create an agent job under a project",
  "Run scenario compare — naive step-burn baseline vs world-model guided routing",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--dsd-ink)] sm:text-4xl md:text-5xl">
            Data Science Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--dsd-ink)] sm:text-3xl">
            Naive agents burn steps a world model can skip
          </h1>
          <p className="max-w-xl text-lg text-[var(--dsd-muted)]">
            Score world-model guided routing against a flat naive step-burn
            baseline — method-lab desk, not a commercial data-science agent
            platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--dsd-teal)] hover:bg-[var(--dsd-teal-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <WorldField className="w-full max-w-xl text-[var(--dsd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--dsd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--dsd-muted)] leading-relaxed">
          Autonomous data-science agents still lean on trial-and-error that
          burns expensive train and search steps. Teams need a desk that scores
          world-model guided routing against a naive step-burn baseline before
          costly execution.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--dsd-ink)]">
          Product
        </h2>
        <p className="text-[var(--dsd-muted)] leading-relaxed">
          Data Science Desk is an org desk that runs world-model guided
          efficiency scoring against a flat naive step-burn baseline, with
          lifecycle, batch, audit, and goldens so the experiment stays
          checkable.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--dsd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--dsd-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--dsd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--dsd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--dsd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-[var(--dsd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--dsd-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--dsd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. This desk is not a
          replacement for the authors&apos; world-model system and not a
          commercial data-science agent platform. Never brand it as DSWorld.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl" data-sources="live">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--dsd-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--dsd-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline text-[var(--dsd-teal)]"
              href="https://arxiv.org/abs/2607.15901v1"
            >
              https://arxiv.org/abs/2607.15901v1
            </a>
          </li>
          <li>Authors&apos; code: none published with this paper</li>
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl pb-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--dsd-ink)]">
          Ready to try the desk?
        </h2>
        <Button
          asChild
          className="bg-[var(--dsd-teal)] hover:bg-[var(--dsd-teal-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
