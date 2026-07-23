import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SlideField } from "@/components/slide-field";

const PAPER = "https://arxiv.org/abs/2607.09526v1";
const CODE = "https://github.com/WonderLandxD/ALICE";

const SELLING = [
  "See when multi-expert tags move the score — and when a single-view baseline stays flat.",
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
      "Vision job create, list, patch, delete",
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
      "Scenario: single-view vs multi-expert",
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
    body: "Create a vision job for the slide cohort you want to probe.",
  },
  {
    n: "2",
    title: "Compare scoring",
    body: "Run single-view baseline vs multi-expert on the same inputs.",
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
          <p className="font-[family-name:var(--font-display)] text-5xl tracking-tight text-[var(--pvd-ink)] sm:text-6xl md:text-7xl">
            Pathology Vision Desk
          </p>
          <h1 className="max-w-2xl text-xl font-medium tracking-tight text-[var(--pvd-ink)] sm:text-2xl">
            Multi-expert tags should not collapse into a single view.
          </h1>
          <p className="max-w-xl text-lg text-[var(--pvd-muted)]">
            A lab desk to compare multi-expert pathology scoring against a naive
            single-view baseline — method experiment, not a clinical diagnostic
            tool.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--pvd-rose)] hover:bg-[var(--pvd-rose-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <SlideField className="w-full max-w-2xl text-[var(--pvd-slate)]" />
      </section>

      <section className="pvd-reveal space-y-3 border-t border-[var(--pvd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--pvd-ink)]">
          The problem
        </h2>
        <p className="max-w-2xl text-[var(--pvd-muted)]">
          When vision, vision-language, and slide-level signals disagree, a
          single-view score hides the alignment that matters. Teams need a clear
          side-by-side — not another opaque clinical product claim.
        </p>
      </section>

      <section className="space-y-3 border-t border-[var(--pvd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--pvd-ink)]">
          The product
        </h2>
        <p className="max-w-2xl text-[var(--pvd-muted)]">
          Pathology Vision Desk is an org workspace for vision jobs: create
          work, enforce lifecycle, compare single-view vs multi-expert scoring,
          batch sibling transitions, and keep an exportable audit. Inspired by
          the paper; never a stand-in for the authors&apos; foundation model.
        </p>
      </section>

      <section className="space-y-6 border-t border-[var(--pvd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--pvd-ink)]">
          Why teams use it
        </h2>
        <ul className="max-w-2xl space-y-4 text-[var(--pvd-muted)]">
          {SELLING.map((line) => (
            <li key={line} className="border-l-2 border-[var(--pvd-rose)] pl-4">
              {line}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-8 border-t border-[var(--pvd-line)]/70 py-14">
        <div className="space-y-2">
          <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--pvd-ink)]">
            Features
          </h2>
          <p className="max-w-xl text-[var(--pvd-muted)]">
            Live capabilities grouped for scanning — not a raw CRUD dump.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          {FEATURE_GROUPS.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--pvd-rose-deep)]">
                {group.title}
              </h3>
              <ul className="space-y-1.5 text-[var(--pvd-muted)]">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 border-t border-[var(--pvd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--pvd-ink)]">
          How it works
        </h2>
        <ol className="grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.n} className="space-y-2">
              <span className="font-[family-name:var(--font-mono)] text-sm text-[var(--pvd-rose)]">
                {step.n}
              </span>
              <h3 className="text-lg font-medium text-[var(--pvd-ink)]">
                {step.title}
              </h3>
              <p className="text-sm text-[var(--pvd-muted)]">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 border-t border-[var(--pvd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--pvd-ink)]">
          Honesty / limits
        </h2>
        <p className="max-w-2xl text-[var(--pvd-muted)]">
          This is a workflow experiment inspired by the paper. It is{" "}
          <strong className="font-medium text-[var(--pvd-ink)]">not</strong> a
          clinical diagnostic tool and{" "}
          <strong className="font-medium text-[var(--pvd-ink)]">not</strong> a
          replacement for the authors&apos; foundation model. Never branded as
          ALICE.
        </p>
      </section>

      <section className="space-y-3 border-t border-[var(--pvd-line)]/70 py-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--pvd-ink)]">
          Sources
        </h2>
        <p className="max-w-2xl text-[var(--pvd-muted)]">
          Paper and authors&apos; code for the inspiration behind this desk:
        </p>
        <ul className="space-y-2 text-[var(--pvd-rose)]">
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

      <section className="space-y-4 border-t border-[var(--pvd-line)]/70 pt-14">
        <h2 className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--pvd-ink)]">
          Ready to try the desk?
        </h2>
        <p className="max-w-xl text-[var(--pvd-muted)]">
          Open the vision job catalog and run your first compare.
        </p>
        <Button
          asChild
          className="bg-[var(--pvd-rose)] hover:bg-[var(--pvd-rose-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
