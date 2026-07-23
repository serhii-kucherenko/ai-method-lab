import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RouteField } from "@/components/route-field";

const SELLING = [
  "Compare cache-aware compression against vanilla, cache-only, and query-aware baselines in one scenario",
  "Keep cache jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so two-tier cost scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / workload catalog",
  "Cache job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (vanilla / cache-only / query-aware vs cache-aware)",
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
  "Open the desk and create a cache job under a workload project",
  "Run scenario compare — query-aware breaks cache; cache-aware keeps a tier-safe prefix",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--scd-ink)] sm:text-4xl md:text-5xl">
            Prompt Cache Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--scd-ink)] sm:text-3xl">
            Compress once; keep the cheap cache tier
          </h1>
          <p className="max-w-xl text-lg text-[var(--scd-muted)]">
            Score query-agnostic compression with a tier-preserving ratio bound
            against naive baselines under a two-tier hit-rate cost model.
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
        <RouteField className="w-full max-w-xl text-[var(--scd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--scd-muted)] leading-relaxed">
          Query-aware compressors rewrite the prefix on every call and wipe the
          cache. Over-compressing can also shove a shared prefix into the hot
          tier where hit rates plateau below one. Teams need a desk that prices
          those choices under a realistic two-tier ρ.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Product
        </h2>
        <p className="text-[var(--scd-muted)] leading-relaxed">
          Prompt Cache Desk is an org desk that runs cache-aware compression
          against vanilla, cache-only, and query-aware baselines, with
          lifecycle, batch, audit, and goldens so the experiment stays
          checkable.
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

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-[var(--scd-muted)]">
          {FEATURES.map((f) => (
            <li key={f} className="leading-relaxed">
              {f}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--scd-muted)]">
          {STEPS.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Honesty
        </h2>
        <p className="text-[var(--scd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a replacement for the
          authors&apos; system. Not a commercial LLM API gateway. Never brand as
          CAPC, Sonnet, or PayPal.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--scd-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--scd-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline"
              href="https://arxiv.org/abs/2607.15516v1"
            >
              https://arxiv.org/abs/2607.15516v1
            </a>
          </li>
          <li>Authors&apos; code: none published</li>
        </ul>
      </section>

      <section className="pt-4">
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
