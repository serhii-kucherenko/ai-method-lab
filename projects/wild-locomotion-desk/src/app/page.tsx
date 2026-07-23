import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RouteField } from "@/components/route-field";

const SELLING = [
  "Compare multi-skill plans against single-skill flat, perception-blind, and no-transition baselines",
  "Keep locomotion jobs honest with lifecycle, batch siblings, and audit export",
  "Browse dual-impl goldens so locomotion scores stay checkable, not theatrical",
  "Org webhooks and roles so rejects and rotates stay visible",
];

const FEATURES = [
  "Org tenancy",
  "Member roles (admin / operator / viewer)",
  "Project / terrain / route profile catalog",
  "Locomotion job create / list / patch / delete",
  "Lifecycle transitions",
  "Illegal transition reject",
  "Optimistic version conflict",
  "Batch sibling transitions",
  "Scenario compare (naive flat policy vs multi-skill + perception)",
  "Audit log",
  "CSV audit export",
  "Goldens browser (≥25 fixtures)",
  "Honesty / disclaimer page",
  "Signed inbound webhooks",
  "Admin webhook rotate",
  "Pagination + search",
  "Rate-limit feedback",
  "Offline try page",
  "Obstacle clearance strip",
  "Scenario JSON export",
];

const STEPS = [
  "Open the desk and create a locomotion job under a terrain profile (stairs, hurdles, gaps, stones, …)",
  "Run scenario compare — naive single-skill flat policy vs a multi-skill perceptive plan",
  "Advance lifecycle or batch, then export the audit trail",
];

export default function LandingPage() {
  return (
    <div data-landing="live" data-home="live" className="space-y-20 pb-8">
      <section className="relative min-h-[70vh] flex flex-col justify-center gap-8 py-10">
        <div className="space-y-5 max-w-2xl">
          <p className="font-[family-name:var(--font-display)] text-3xl tracking-tight text-[var(--wld-ink)] sm:text-4xl md:text-5xl">
            Wild Locomotion Desk
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-[var(--wld-ink)] sm:text-3xl">
            Switch skills — clear mixed obstacles
          </h1>
          <p className="max-w-xl text-lg text-[var(--wld-muted)]">
            Skill library plus onboard perception and autonomous transitions —
            against a single-skill flat-terrain policy that fails on stairs,
            gaps, and hurdles.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-[var(--wld-steel)] hover:bg-[var(--wld-steel-deep)]"
            >
              <Link href="/jobs">Open desk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/honesty">Read honesty</Link>
            </Button>
          </div>
        </div>
        <RouteField className="w-full max-w-xl text-[var(--wld-cyan)]" />
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--wld-ink)]">
          Problem
        </h2>
        <p className="text-[var(--wld-muted)] leading-relaxed">
          Flat-terrain policies look fine until stairs, hurdles, gaps, or stones
          appear. A single skill with no perception and no autonomous transitions
          stalls or high-risks on structured obstacles. Mixed wild routes need a
          skill library that can switch.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--wld-ink)]">
          Product
        </h2>
        <p className="text-[var(--wld-muted)] leading-relaxed">
          Wild Locomotion Desk scores multi-skill perceptive plans beside naive
          single-skill flat baselines, with jobs, audit, and dual-impl goldens.
          Soft simulation — not robot hardware and never branded APT-RL.
        </p>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--wld-ink)]">
          Selling points
        </h2>
        <ul className="space-y-2 text-[var(--wld-muted)]">
          {SELLING.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--wld-ink)]">
          Features
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm text-[var(--wld-muted)]">
          {FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--wld-ink)]">
          How it works
        </h2>
        <ol className="list-decimal pl-5 space-y-2 text-[var(--wld-muted)]">
          {STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--wld-ink)]">
          Honesty / limits
        </h2>
        <p className="text-[var(--wld-muted)] leading-relaxed">
          Workflow experiment inspired by the paper. Not a replacement for the
          authors&apos; quadruped controller or commercial robot stacks. Soft
          simulation only. Never brand APT-RL as the product name.
        </p>
      </section>

      <section className="space-y-3 max-w-2xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--wld-ink)]">
          Sources
        </h2>
        <ul className="space-y-1 text-[var(--wld-muted)]">
          <li>
            Paper:{" "}
            <a
              className="underline"
              href="https://arxiv.org/abs/2607.13579v1"
            >
              https://arxiv.org/abs/2607.13579v1
            </a>
          </li>
          <li>Authors&apos; code: none published</li>
        </ul>
      </section>

      <section className="pt-4">
        <Button
          asChild
          className="bg-[var(--wld-steel)] hover:bg-[var(--wld-steel-deep)]"
        >
          <Link href="/jobs">Open desk</Link>
        </Button>
      </section>
    </div>
  );
}
