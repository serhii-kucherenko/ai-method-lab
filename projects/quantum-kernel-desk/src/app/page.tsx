import Link from "next/link";
import { Button } from "@/components/ui/button";
import { KernelStrip } from "@/components/kernel-strip";

const SELLING = [
  "Compare quantum multiple-kernel SAR plans against classical linear, RBF-only, and feature-blind baselines",
  "Keep kernel jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so kernel scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / assay / series profile catalog",
  "Kernel job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (linear / RBF / feature-blind vs quantum multi-kernel)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Kernel-feature cell strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a kernel job under an assay / series profile",
  "Run scenario compare — classical linear / RBF-only / feature-blind vs quantum multi-kernel activity scoring",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--qkd-ink)] sm:text-4xl md:text-5xl">
            Quantum Kernel Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--qkd-ink)] sm:text-3xl">
            Stack quantum maps — score activity
          </h1>
          <p className="max-w-xl text-lg text-[var(--qkd-muted)]">
            Multi-kernel quantum-style feature maps for structure–activity
            scoring — against a classical single linear kernel, a single
            RBF-only model, or feature-blind flat scores.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--qkd-steel)] hover:bg-[var(--qkd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <KernelStrip className="w-full max-w-xl text-[var(--qkd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--qkd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--qkd-muted)] leading-relaxed">
          Classical single-kernel SAR models stall when activity depends on
          richer feature geometry. Linear-only and RBF-only baselines miss
          multi-kernel structure; feature-blind flat scores ignore the maps
          entirely.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--qkd-ink)]">
          Product
        </h2>
        <p className="text-[var(--qkd-muted)] leading-relaxed">
          Quantum Kernel Desk scores quantum multiple-kernel SAR plans beside
          naive classical baselines, with jobs, audit, and dual-impl goldens.
          Soft simulation — not quantum hardware and not a commercial QSAR
          replacement. Never brand the desk as Q²SAR.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--qkd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--qkd-muted)]">
          {SELLING.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--qkd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-[var(--qkd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--qkd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--qkd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl border-t border-[var(--qkd-line)] pt-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--qkd-ink)]">
          Honesty
        </h2>
        <p className="text-[var(--qkd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a replacement for the
          authors&apos; Q²SAR pipeline or commercial QSAR and quantum chemistry
          tools. Never brand Q²SAR as the product name.
        </p>
        <p className="text-sm text-[var(--qkd-muted)]">
          Paper:{" "}
          <a
            className="underline underline-offset-2"
            href="https://arxiv.org/abs/2607.11701v1"
          >
            arxiv.org/abs/2607.11701v1
          </a>
          . Authors&apos; code: none published.
        </p>
      </section>
    </div>
  );
}
