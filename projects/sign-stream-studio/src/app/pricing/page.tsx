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
    name: "Pilot",
    price: "$69 / seat / mo",
    hook: "Seats for language-access product leads",
    includes: [
      "Sign stream registry",
      "Sentence segment workspace",
      "Latency budget board",
      "Up to 500 stream compares / mo",
      "Honesty fence + exports (JSON/CSV)",
    ],
  },
  {
    name: "Institution",
    price: "$169 / seat / mo + stream minutes",
    hook: "Seats + per-stream-minute usage",
    includes: [
      "Everything in Pilot",
      "Higher compare quota (5k / mo)",
      "Glossary coverage editor",
      "Idempotent webhook + rate-limit controls",
      "Member roles (owner / reader / viewer)",
    ],
    highlight: true,
  },
  {
    name: "Site license",
    price: "Custom / site / yr",
    hook: "Org-wide language-access packaging",
    includes: [
      "Everything in Institution",
      "Shared org settings + audit trail",
      "Priority method-lab support window",
      "Custom stream-profile defaults",
      "Volume stream-compare pricing",
    ],
  },
];

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical SaaS packaging aligned to institution seats and stream minutes — method-lab only, not live checkout."
    >
      <p className="mb-8 max-w-2xl text-sm text-slate-600">
        Money hook for Sign Stream Studio: institution seats plus stream-minute
        usage. Cards below are packaging sketches for the Method Lab experiment
        — there is no payment provider or card capture here. This is method-lab
        packaging honesty, not a live checkout.
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={
              tier.highlight
                ? "rounded-lg border-2 border-[var(--studio-aqua)] bg-[var(--studio-panel)] p-5"
                : "rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
            }
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
              {tier.name}
            </h2>
            <p className="mt-2 text-lg text-[var(--studio-aqua-deep)]">
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
