import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Pilot",
    price: "$2.4k / season",
    seats: "3 seats",
    includes: [
      "2 terrain packs",
      "4 aerial refreshes",
      "Physics-aware vs naive compare",
      "Export JSON",
    ],
  },
  {
    name: "Agency",
    price: "$14k / year",
    seats: "15 seats + refresh compute",
    includes: [
      "Unlimited packs (soft-sim)",
      "Alignment plan board",
      "Audit trail + CSV export",
      "Webhook + member invite",
      "Priority onboarding checklist",
    ],
  },
  {
    name: "Site license",
    price: "Custom",
    seats: "Multi-unit GIS desk",
    includes: [
      "Agency features",
      "Shared org settings",
      "Rate-limit tuning",
      "Guide + demo workshop",
    ],
  },
];

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical seats + refresh compute packaging for method-lab experiments — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--studio-ember)]">
              {tier.name}
            </h2>
            <p className="mt-2 text-xl font-semibold">{tier.price}</p>
            <p className="text-sm text-stone-500">{tier.seats}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-stone-600">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-stone-500">
        No card form. See{" "}
        <Link href="/honesty" className="underline">
          honesty
        </Link>{" "}
        for soft-sim limits.
      </p>
      <Button asChild className="mt-4">
        <Link href="/onboarding">Continue to onboarding</Link>
      </Button>
    </StudioShell>
  );
}
