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
    price: "$49 / seat / mo",
    hook: "Seats for trust/eval leads",
    includes: [
      "Claim registry + attestations",
      "Soft-sim proof walker",
      "Evidence ledger",
      "Up to 500 attest compares / mo",
      "Honesty fence + exports (JSON/CSV)",
    ],
  },
  {
    name: "Platform",
    price: "$149 / seat / mo + usage",
    hook: "Seats + per-attest run usage",
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
    hook: "Org-wide eval packaging",
    includes: [
      "Everything in Platform",
      "Shared org settings + audit trail",
      "Priority method-lab support window",
      "Custom soft-sim profile defaults",
      "Volume attest-run pricing",
    ],
  },
];

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical SaaS packaging aligned to eval seats and per-attest usage — method-lab only, not live checkout."
    >
      <p className="mb-8 max-w-2xl text-sm text-slate-600">
        Money hook for Attest Proof Studio: eval seats plus per-attest run usage
        for AI platform / trust-eval teams. Cards below are packaging sketches for
        the Method Lab experiment — there is no payment provider or card capture
        here.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={
              tier.highlight
                ? "rounded-lg border-2 border-[var(--studio-teal)] bg-[var(--studio-panel)] p-5"
                : "rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
            }
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
              {tier.name}
            </h2>
            <p className="mt-2 text-lg text-[var(--studio-teal-deep)]">
              {tier.price}
            </p>
            <p className="mt-1 text-sm text-slate-500">{tier.hook}</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        Honesty: this is method-lab packaging for buyer-story clarity. No Stripe,
        no invoices, no live card checkout.
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/onboarding">Start onboarding</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/demo">Try guided demo</Link>
        </Button>
      </div>
    </StudioShell>
  );
}
