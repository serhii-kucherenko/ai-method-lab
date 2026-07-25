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
    name: "Ops",
    price: "$79 / seat / mo",
    hook: "Seats for marketplace matching leads",
    includes: [
      "Match candidate registry",
      "Hold decision board",
      "Passenger + driver experience lanes",
      "Up to 500 hold compares / mo",
      "Honesty fence + exports (JSON/CSV)",
    ],
  },
  {
    name: "Marketplace",
    price: "$189 / seat / mo + usage",
    hook: "Seats + per-hold-compare usage",
    includes: [
      "Everything in Ops",
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
    hook: "Org-wide matching ops packaging",
    includes: [
      "Everything in Marketplace",
      "Shared org settings + audit trail",
      "Priority method-lab support window",
      "Custom hold-profile defaults",
      "Volume hold-compare pricing",
    ],
  },
];

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical SaaS packaging aligned to ops seats and hold-compare usage — method-lab only, not live checkout."
    >
      <p className="mb-8 max-w-2xl text-sm text-slate-600">
        Money hook for Hold Match Studio: marketplace ops seats plus per-hold
        compare usage. Cards below are packaging sketches for the Method Lab
        experiment — there is no payment provider or card capture here. This is
        method-lab packaging honesty, not a live checkout.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={
              tier.highlight
                ? "rounded-lg border-2 border-[var(--studio-amber)] bg-[var(--studio-panel)] p-5"
                : "rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
            }
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
              {tier.name}
            </h2>
            <p className="mt-2 text-lg text-[var(--studio-amber-deep)]">
              {tier.price}
            </p>
            <p className="mt-1 text-sm text-slate-500">{tier.hook}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-slate-500">
        No live checkout. See{" "}
        <Link href="/honesty" className="underline">
          honesty
        </Link>{" "}
        ·{" "}
        <Button asChild variant="outline" size="sm" className="ml-1">
          <Link href="/onboarding">Start onboarding</Link>
        </Button>
      </p>
    </StudioShell>
  );
}
