import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ControlField } from "@/components/control-field";

const SELLING = [
  "Compare safer agentic counterfactual control against a naive open-loop baseline in one scenario",
  "Keep control jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so risk scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project catalog",
  "Control job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (naive open-loop vs safer agentic)",
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
  "Open the desk and create a control job under a project",
  "Run scenario compare — naive open-loop baseline vs safer agentic counterfactual control",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--scd-ink)] sm:text-4xl md:text-5xl">
            Security Control Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--scd-ink)] sm:text-3xl">
            Open-loop agents act before physics can veto
          </h1>
          <p className="max-w-xl text-lg text-[var(--scd-muted)]">
            Score safer agentic counterfactual control against a flat naive open-loop
            baseline — method-lab desk, not a commercial industrial-control agent
            platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--scd-steel)] hover:bg-[var(--scd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <ControlField className="w-full max-w-xl text-[var(--scd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--scd-muted)] leading-relaxed">
          Autonomous industrial agents still lean on open-loop actuations that
          can hallucinate or worsen a tank-level breach. Teams need a desk that
          scores safer agentic counterfactual control against a naive open-loop
          baseline before anything moves a valve.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Product
        </h2>
        <p className="text-[var(--scd-muted)] leading-relaxed">
          Security Control Desk is an org desk that runs counterfactual physics
          injection against a flat naive open-loop baseline, with lifecycle,
          batch, audit, and goldens so the experiment stays checkable.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--scd-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--scd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-[var(--scd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--scd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. This desk is not a
          replacement for the authors&apos; neuro-agentic control system and not a
          commercial industrial-control product. Never brand it as Neuro-Agentic Control.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl" data-sources="live">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--scd-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline text-[var(--scd-steel)]"
              href="https://arxiv.org/abs/2607.09076v1"
            >
              https://arxiv.org/abs/2607.09076v1
            </a>
          </li>
          <li>Authors&apos; code: none published with this paper</li>
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl pb-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Ready to try the desk?
        </h2>
        <Button
          asChild
          className="bg-[var(--scd-steel)] hover:bg-[var(--scd-steel-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
