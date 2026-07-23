import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TutorField } from "@/components/tutor-field";

const SELLING = [
  "Compare multi-LLM orchestration against single-model tutoring in one scenario",
  "Keep tutor jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project catalog",
  "Tutor job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (single-model vs multi-LLM)",
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
  "Open the desk and create a tutor job under a project",
  "Run scenario compare — single-model baseline vs multi-LLM orchestrated score",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--std-ink)] sm:text-4xl md:text-5xl">
            Secure Tutor Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--std-ink)] sm:text-3xl">
            One model should not teach every security lesson alone
          </h1>
          <p className="max-w-xl text-lg text-[var(--std-muted)]">
            See how a multi-LLM orchestrated tutor score beats a naive
            single-model baseline on pedagogical roles and learner intent — in a
            method-lab desk, not a live tutoring course product.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--std-teal)] hover:bg-[var(--std-teal-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <TutorField className="w-full max-w-xl text-[var(--std-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--std-ink)]">
          Problem
        </h2>
        <p className="text-[var(--std-muted)] leading-relaxed">
          Secure coding is taught late, accessibility is an afterthought, and a
          single tutoring model misses vulnerabilities another model would catch.
          Learners need staged hints and role-split guidance — not one chat box
          that answers everything at once.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--std-ink)]">
          Product
        </h2>
        <p className="text-[var(--std-muted)] leading-relaxed">
          Secure Tutor Desk is an org desk that runs multi-LLM orchestrated tutor
          scoring against a flat single-model baseline, with lifecycle, batch,
          audit, and goldens so the experiment stays checkable.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--std-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--std-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--std-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--std-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--std-ink)]">
          How it works
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-[var(--std-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--std-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--std-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. This desk is not a
          replacement for the authors&apos; tutoring platform and not a live
          tutoring course product. Never brand it as SYNAPSE.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl" data-sources="live">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--std-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--std-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline text-[var(--std-teal)]"
              href="https://arxiv.org/abs/2607.14601v1"
            >
              https://arxiv.org/abs/2607.14601v1
            </a>
          </li>
          <li>Authors&apos; code: none published with this paper</li>
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl pb-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--std-ink)]">
          Open the desk
        </h2>
        <Button
          asChild
          className="bg-[var(--std-teal)] hover:bg-[var(--std-teal-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
