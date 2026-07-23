import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BombField } from "@/components/bomb-field";

const SELLING = [
  "Compare formal trigger synthesis against a naive scan baseline in one scenario",
  "Keep verification jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so bomb scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project catalog",
  "Verification job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (naive scan vs formal trigger synthesis)",
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
  "Open the desk and create a verification job under a project",
  "Run scenario compare — naive scan baseline vs formal trigger synthesis",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--lld-ink)] sm:text-4xl md:text-5xl">
            Ladder Logic Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--lld-ink)] sm:text-3xl">
            Naive scans miss bombs that formal triggers catch
          </h1>
          <p className="max-w-xl text-lg text-[var(--lld-muted)]">
            Score formal trigger synthesis against a flat naive scan baseline on
            adaptive and syntactic triggers — method-lab desk, not a commercial
            PLC security product.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--lld-teal)] hover:bg-[var(--lld-teal-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <BombField className="w-full max-w-xl text-[var(--lld-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lld-ink)]">
          Problem
        </h2>
        <p className="text-[var(--lld-muted)] leading-relaxed">
          Malicious ladder fragments can sit dormant inside controller programs
          until a precise trigger fires. Pattern scans and short simulations
          miss adaptive and opaque triggers. Teams need a desk that scores
          semantic trigger recovery against a naive scan baseline.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lld-ink)]">
          Product
        </h2>
        <p className="text-[var(--lld-muted)] leading-relaxed">
          Ladder Logic Desk is an org desk that runs formal trigger-synthesis
          scoring against a flat naive scan baseline, with lifecycle, batch,
          audit, and goldens so the experiment stays checkable.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lld-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--lld-muted)]">
          {SELLING.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lld-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--lld-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lld-ink)]">
          How it works
        </h2>
        <ol className="list-decimal list-inside space-y-2 text-[var(--lld-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lld-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--lld-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. This desk is not a
          replacement for the authors&apos; formal verifier and not a commercial
          PLC security product. Never brand it as the authors&apos; tool names or
          as IEC statute codes.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl" data-sources="live">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lld-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--lld-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline text-[var(--lld-teal)]"
              href="https://arxiv.org/abs/2607.08417v1"
            >
              https://arxiv.org/abs/2607.08417v1
            </a>
          </li>
          <li>Authors&apos; code: none published with this paper</li>
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl pb-10">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lld-ink)]">
          Ready to try the desk?
        </h2>
        <Button
          asChild
          className="bg-[var(--lld-teal)] hover:bg-[var(--lld-teal-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
