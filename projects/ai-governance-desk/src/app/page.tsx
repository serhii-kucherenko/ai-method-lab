import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RouteField } from "@/components/route-field";

const SELLING = [
  "Compare preference-aligned proposals against always-innovation, always-private, and always-national baselines",
  "Keep governance preference jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so conjoint preference scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / governance domain catalog",
  "Governance preference job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (tech-first / always-private / always-national vs preference-aligned)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Preference clarity strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a governance preference job under a domain (workplace, policing, warfare, …)",
  "Run scenario compare — tech-first and single-axis naives vs a preference-aligned proposal",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--agd-ink)] sm:text-4xl md:text-5xl">
            AI Governance Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--agd-ink)] sm:text-3xl">
            Score preferences — then compare governance proposals
          </h1>
          <p className="max-w-xl text-lg text-[var(--agd-muted)]">
            Conjoint preference scoring across safety versus innovation, public
            versus private, and international versus national — against naive
            tech-first baselines.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--agd-steel)] hover:bg-[var(--agd-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <RouteField className="w-full max-w-xl text-[var(--agd-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--agd-ink)]">
          Problem
        </h2>
        <p className="text-[var(--agd-muted)] leading-relaxed">
          Tech-first proposals push innovation, private control, and national
          scope even when public preference leans the other way. Teams need a
          desk that scores those leans — by domain and risk perception — instead
          of a single glowing “move fast” default.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--agd-ink)]">
          Product
        </h2>
        <p className="text-[var(--agd-muted)] leading-relaxed">
          AI Governance Desk runs conjoint preference scoring beside always-
          innovation, always-private, and always-national baselines, with jobs,
          audit, and dual-impl goldens. A method experiment — not a regulator
          product.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--agd-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--agd-muted)]">
          {SELLING.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--agd-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-[var(--agd-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--agd-ink)]">
          How it works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--agd-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--agd-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--agd-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a replacement for the
          authors&apos; survey research or OSF materials. Not a government AI
          regulation product. Never brand as a government AI regulator or EU AI
          Act product name.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--agd-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--agd-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline"
              href="https://arxiv.org/abs/2607.14585v1"
            >
              https://arxiv.org/abs/2607.14585v1
            </a>
          </li>
          <li>
            Authors&apos; code: none published · OSF pre-registration:{" "}
            <a className="underline" href="https://osf.io/5rz9p/">
              https://osf.io/5rz9p/
            </a>
          </li>
        </ul>
      </section>

      <section className="pt-4">
        <Button
          asChild
          className="bg-[var(--agd-steel)] hover:bg-[var(--agd-steel-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
