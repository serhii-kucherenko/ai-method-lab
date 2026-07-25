import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const TIERS: {
  name: string;
  price: string;
  hook: string;
  includes: string[];
  highlight?: boolean;
}[] = [
  {
    name: "Evaluator",
    price: "$59 / seat / mo",
    hook: "Seats for multimodal eval leads",
    includes: [
      "Clip + character registry",
      "Track-probe workspace",
      "Failure taxonomy",
      "Up to 500 track compares / mo",
      "Honesty fence + exports (JSON/CSV)",
    ],
  },
  {
    name: "Platform",
    price: "$169 / seat / mo + usage",
    hook: "Seats + per-probe run usage",
    includes: [
      "Everything in Evaluator",
      "Higher compare quota (5k / mo)",
      "Idempotent webhook + rate-limit controls",
      "Member roles (owner / reader / viewer)",
      "Goldens sample API for benches",
    ],
    highlight: true,
  },
  {
    name: "Site license",
    price: "Custom / site / yr",
    hook: "Org-wide Video-LLM eval packaging",
    includes: [
      "Everything in Platform",
      "Shared org settings + audit trail",
      "Priority method-lab support window",
      "Custom track-profile defaults",
      "Volume probe-run pricing",
    ],
  },
];

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical SaaS packaging aligned to eval seats and per-probe usage — method-lab only, not live checkout."
    >
      <p className="mb-8 max-w-2xl text-sm text-slate-600">
        Money hook for Video Track Studio: eval seats plus per-probe run usage
        for multimodal / Video-LLM product teams. Cards below are packaging
        sketches for the Method Lab experiment — there is no payment provider or
        card capture here.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={
              tier.highlight
                ? "rounded-lg border-2 border-[var(--studio-coral)] bg-[var(--studio-panel)] p-5"
                : "rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
            }
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
              {tier.name}
            </h2>
            <p className="mt-2 text-lg text-[var(--studio-coral-deep)]">
              {tier.price}
            </p>
            <p className="mt-1 text-sm text-slate-500">{tier.hook}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {tier.includes.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Method-lab packaging honesty: these tiers illustrate the money story —
        not live billing.{" "}
        <Button asChild variant="link" className="px-0">
          <Link href="/onboarding">Continue to onboarding</Link>
        </Button>
      </p>
    </StudioShell>
  );
}
