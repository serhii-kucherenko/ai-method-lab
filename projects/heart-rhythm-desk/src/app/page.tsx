import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EcgTrace } from "@/components/ecg-trace";

const PAPER = "https://arxiv.org/abs/2607.14613v1";
const CODE = "https://github.com/Open-EXG/AG-SCL-for-Long-Tailed-ECG";

const SELLING = [
  "See when rare rhythm tags actually move the score — and when the majority baseline stays flat.",
  "Keep every compare, transition, and reject on an audit trail you can export.",
  "Run batch sibling updates without one failure poisoning the rest.",
  "Browse dual-implementation goldens so the desk math stays checkable.",
];

const FEATURE_GROUPS = [
  {
    title: "Org & jobs",
    items: [
      "Org tenancy and member roles",
      "Project catalog",
      "Rhythm job create, list, patch, delete",
      "Pagination and search",
    ],
  },
  {
    title: "Workflow",
    items: [
      "Lifecycle draft → queued → running → terminal",
      "Illegal transition reject",
      "Optimistic version conflict",
      "Independent batch transitions",
    ],
  },
  {
    title: "Compare & evidence",
    items: [
      "Scenario: majority vs long-tail-aware",
      "Audit log and CSV export",
      "Goldens browser (≥25 fixtures)",
      "Honesty and Sources pages",
    ],
  },
  {
    title: "Integrations",
    items: [
      "Webhook inbound with HMAC and idempotency",
      "Admin webhook secret rotate",
      "Rate-limit feedback (429 + Retry-After)",
      "Offline try page and tutor guide",
    ],
  },
];

const STEPS = [
  {
    n: "1",
    title: "Open the desk",
    body: "Create a rhythm job for the cohort you want to probe.",
  },
  {
    n: "2",
    title: "Compare scoring",
    body: "Run majority baseline vs long-tail-aware on the same inputs.",
  },
  {
    n: "3",
    title: "Audit the path",
    body: "Advance lifecycle, batch siblings, and export the trail.",
  },
];

export default function LandingPage() {
  return (
    <div data-home="live" data-landing="live" className="pb-16">
      <section className="relative flex min-h-[min(100vh,44rem)] flex-col justify-center gap-8 py-10 sm:py-16">
        <div className="space-y-5">
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--hrd-ink)] sm:text-6xl md:text-7xl">
            Heart Rhythm Desk
          </p>
          <h1 className="max-w-2xl text-xl font-medium tracking-tight text-[var(--hrd-ink)] sm:text-2xl">
            Rare rhythms should not vanish into the majority score.
          </h1>
          <p className="max-w-xl text-lg text-[var(--hrd-muted)]">
            A lab desk to compare long-tail-aware rhythm scoring against a naive
            majority baseline — method experiment, not a clinical ECG reader.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--hrd-teal)] hover:bg-[var(--hrd-teal-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <EcgTrace className="w-full max-w-2xl text-[var(--hrd-signal)]" />
      </section>

      <section className="hrd-reveal space-y-3 border-t border-[var(--hrd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--hrd-ink)]">
          The problem
        </h2>
        <p className="max-w-2xl text-[var(--hrd-muted)]">
          When rare arrhythmia classes are scarce in the training mix, a flat
          majority score under-weights the tags that matter most. Teams need a
          clear side-by-side — not another opaque clinical product claim.
        </p>
      </section>

      <section className="space-y-3 border-t border-[var(--hrd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--hrd-ink)]">
          The product
        </h2>
        <p className="max-w-2xl text-[var(--hrd-muted)]">
          Heart Rhythm Desk is an org workspace for rhythm jobs: create work,
          enforce lifecycle, compare majority vs long-tail-aware scoring, batch
          sibling transitions, and keep an exportable audit. Inspired by the
          paper; never a stand-in for the authors&apos; trained model.
        </p>
      </section>

      <section className="space-y-6 border-t border-[var(--hrd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--hrd-ink)]">
          Why teams use it
        </h2>
        <ul className="max-w-2xl space-y-4 text-[var(--hrd-muted)]">
          {SELLING.map((line) => (
            <li key={line} className="border-l-2 border-[var(--hrd-teal)] pl-4">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-8 border-t border-[var(--hrd-line)]/70 py-14">
        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--hrd-ink)]">
            Features
          </h2>
          <p className="max-w-xl text-[var(--hrd-muted)]">
            Live capabilities grouped for scanning — not a raw CRUD dump.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {FEATURE_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--hrd-teal-deep)]">
                {group.title}
              </h3>
              <ul className="space-y-1.5 text-[var(--hrd-muted)]">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 border-t border-[var(--hrd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--hrd-ink)]">
          How it works
        </h2>
        <ol className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="space-y-2">
              <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--hrd-teal)]">
                {step.n}
              </span>
              <h3 className="text-lg font-medium text-[var(--hrd-ink)]">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--hrd-muted)]">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 border-t border-[var(--hrd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--hrd-ink)]">
          Honesty / limits
        </h2>
        <p className="max-w-2xl text-[var(--hrd-muted)]">
          This is a workflow experiment inspired by the paper. It is{" "}
          <strong className="font-medium text-[var(--hrd-ink)]">not</strong> a
          clinical ECG reader and{" "}
          <strong className="font-medium text-[var(--hrd-ink)]">not</strong> a
          replacement for the authors&apos; model. Never branded as AG-SCL.
        </p>
      </section>

      <section className="space-y-3 border-t border-[var(--hrd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--hrd-ink)]">
          Sources
        </h2>
        <p className="max-w-2xl text-[var(--hrd-muted)]">
          Paper and authors&apos; code for the inspiration behind this desk:
        </p>
        <ul className="space-y-2 text-[var(--hrd-teal)]">
          <li>
            <a
              className="underline-offset-2 hover:underline"
              href={PAPER}
              rel="noreferrer"
              target="_blank"
            >
              {PAPER}
            </a>
          </li>
          <li>
            <a
              className="underline-offset-2 hover:underline"
              href={CODE}
              rel="noreferrer"
              target="_blank"
            >
              {CODE}
            </a>
          </li>
        </ul>
      </section>

      <section className="space-y-4 border-t border-[var(--hrd-line)]/70 pt-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--hrd-ink)]">
          Ready to try the desk?
        </h2>
        <p className="max-w-xl text-[var(--hrd-muted)]">
          Open the rhythm job catalog and run your first compare.
        </p>
        <Button
          asChild
          className="bg-[var(--hrd-teal)] hover:bg-[var(--hrd-teal-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
