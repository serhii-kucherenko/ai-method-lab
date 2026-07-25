import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    blurb: "Soft-sim campaign packs and dual A/B for one medchem lead.",
    points: ["3 campaign packs", "Sample-efficient vs naive compare", "try.html offline"],
  },
  {
    name: "Team",
    price: "$480/mo",
    blurb: "Shared packs, targets, optimizers, and webhook exports for a design pod.",
    points: [
      "Unlimited soft-sim runs",
      "Members + audit trail",
      "HMAC webhooks + CSV/JSON export",
    ],
  },
  {
    name: "Bench",
    price: "Talk to us",
    blurb: "Private sample budgets and method-lab scoring reviews.",
    points: ["Private golden sets", "Rate-limit controls", "Guided onboarding"],
  },
];

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab seats for sample-efficient campaign soft-sim — not wet-lab SaaS."
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
            <p className="mt-2 text-2xl font-semibold text-[var(--ms-accent)]">
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
        Soft-sim honesty: scores are method-lab fixtures. Not wet-lab validated.
      </p>
      <Button asChild className="mt-4">
        <Link href="/onboarding">Start onboarding</Link>
      </Button>
    </StudioShell>
  );
}
