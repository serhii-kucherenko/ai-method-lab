import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RouteField } from "@/components/route-field";

const SELLING = [
  "Compare stage-gated plans against short-bench, assume-4-bit-faster, and hand-GEMM-ceiling baselines",
  "Keep stage-validate jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so stage-gate scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / port / workload profile catalog",
  "Stage-validate job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (naive intuition vs stage-gated + measurements)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Stage gate clarity strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a stage-validate job under a workload profile (longctx, quant4, kernel, …)",
  "Run scenario compare — naive short-bench intuition vs a stage-gated measured plan",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--svd-ink)] sm:text-4xl md:text-5xl">
            Stage Validate Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--svd-ink)] sm:text-3xl">
            Gate each stage — then measure before done
          </h1>
          <p className="max-w-xl text-lg text-[var(--svd-muted)]">
            Stage gates plus tiered long-context, bit-width, and kernel
            measurements — against naive intuition that skips gates and trusts
            short benches.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--svd-steel)] hover:bg-[var(--svd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <RouteField className="w-full max-w-xl text-[var(--svd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--svd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--svd-muted)] leading-relaxed">
          Teams ship inference ports on short benches alone — assume 4-bit is
          faster, treat hand GEMM as the ceiling, and let 2k stand in for 10k.
          Measurement overturns that intuition; stage gates catch the miss before
          “done.”
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--svd-ink)]">
          Product
        </h2>
        <p className="text-[var(--svd-muted)] leading-relaxed">
          Stage Validate Desk scores stage-gated plans beside naive short-bench
          baselines, with jobs, audit, and dual-impl goldens. Soft simulation —
          not a Fermi CUDA engine and never branded MiniCPM or Tesla C2075.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--svd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--svd-muted)]">
          {SELLING.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--svd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-[var(--svd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--svd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--svd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--svd-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--svd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a replacement for the
          authors&apos; Fermi CUDA engine or commercial inference stacks. Never
          brand MiniCPM, Fermi, or Tesla C2075 as the product name.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--svd-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--svd-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline"
              href="https://arxiv.org/abs/2607.14568v1"
            >
              https://arxiv.org/abs/2607.14568v1
            </a>
          </li>
          <li>Authors&apos; code: none published</li>
        </ul>
      </section>

      <section className="pt-4">
        <Button
          asChild
          className="bg-[var(--svd-steel)] hover:bg-[var(--svd-steel-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
