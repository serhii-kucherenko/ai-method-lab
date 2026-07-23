import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PipelineField } from "@/components/pipeline-field";

const SELLING = [
  "Compare harness-guided placement against manual knob-tuning in one scenario",
  "Keep deploy jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project catalog",
  "Deploy job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (manual vs harness)",
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
  "Open the desk and create a deploy job under a project",
  "Run scenario compare — manual-tuning baseline vs harness-guided score",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--rdd-ink)] sm:text-4xl md:text-5xl">
            Realtime Deploy Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--rdd-ink)] sm:text-3xl">
            Stop hand-tuning every realtime pipeline
          </h1>
          <p className="max-w-xl text-lg text-[var(--rdd-muted)]">
            See how a harness-guided deploy score beats a naive manual-tuning
            baseline on latency and config fit — in a method-lab desk, not a
            production serving stack.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--rdd-teal)] hover:bg-[var(--rdd-teal-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <PipelineField className="w-full max-w-xl text-[var(--rdd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--rdd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--rdd-muted)] leading-relaxed">
          Realtime multimodal apps need placement, streaming, and parallelism
          choices. Manual knob-tuning does not scale when every new pipeline
          wants a different latency or throughput tradeoff.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--rdd-ink)]">
          Product
        </h2>
        <p className="text-[var(--rdd-muted)] leading-relaxed">
          Realtime Deploy Desk is an org desk that runs harness-guided deploy
          scoring against a naive manual-tuning baseline, with jobs, lifecycle,
          audit, and goldens so the claim stays inspectable.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--rdd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--rdd-muted)]">
          {SELLING.map((line) => (
            <li key={line} className="flex gap-2">
              <span className="text-[var(--rdd-teal)]" aria-hidden>
                —
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--rdd-ink)]">
          Features
        </h2>
        <ul className="columns-1 sm:columns-2 gap-x-8 space-y-1.5 text-[var(--rdd-muted)]">
          {FEATURES.map((f) => (
            <li key={f} className="break-inside-avoid">
              {f}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--rdd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--rdd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--rdd-ink)]">
          Honesty
        </h2>
        <p className="text-[var(--rdd-muted)] leading-relaxed">
          This is a workflow experiment inspired by the paper. It is not a
          replacement for the authors&apos; harness and not a production
          serving stack. Never brand this product as FlashRT.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl" data-sources="live">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--rdd-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--rdd-muted)]">
          <li>
            Paper:{" "}
            <a
              className="text-[var(--rdd-teal)] underline-offset-2 hover:underline"
              href="https://arxiv.org/abs/2607.18171v1"
            >
              https://arxiv.org/abs/2607.18171v1
            </a>
          </li>
          <li>Authors&apos; code: none published with this paper</li>
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl border-t border-[var(--rdd-line)] pt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--rdd-ink)]">
          Ready to try the desk?
        </h2>
        <Button
          asChild
          className="bg-[var(--rdd-teal)] hover:bg-[var(--rdd-teal-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
