import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    blurb: "Soft-sim deck packs and dual A/B for one lab-automation lead.",
    points: [
      "3 deck packs",
      "Assay-aware vs naive compare",
      "try.html offline",
    ],
  },
  {
    name: "Team",
    price: "$480/mo",
    blurb: "Shared packs, assays, monitors, and webhook exports for a liquid-handling pod.",
    points: [
      "Unlimited soft-sim runs",
      "Members + audit trail",
      "HMAC webhooks + CSV/JSON export",
    ],
  },
  {
    name: "Bench",
    price: "Talk to us",
    blurb: "Private tip budgets and method-lab scoring reviews.",
    points: ["Private golden sets", "Rate-limit controls", "Guided onboarding"],
  },
];

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab seats for assay-aware protocol soft-sim — not certified compliance SaaS."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {t.name}
            </h2>
            <p className="mt-2 text-2xl font-semibold text-[var(--ag-aqua)]">
              {t.price}
            </p>
            <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {t.blurb}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {t.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim honesty: scores are method-lab fixtures. Not certified
        compliance. Not live robot control.
      </p>
      <Button asChild className="mt-4">
        <Link href="/onboarding">Start onboarding</Link>
      </Button>
    </StudioShell>
  );
}
