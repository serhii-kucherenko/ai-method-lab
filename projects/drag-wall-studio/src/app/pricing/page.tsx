import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    detail: "Channel packs, actuators, sensors, and dual goldens for method-lab soft-sim.",
  },
  {
    name: "Team",
    price: "$49 / seat",
    detail: "Org members, webhook HMAC, export, audit trail, and scoreboard shares.",
  },
  {
    name: "Plant review",
    price: "Custom",
    detail: "Private channel packs and review seats — still soft-sim, never live plant.",
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Bench seats for fluid-control teams comparing ES closed-loop wall controllers."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {t.name}
            </h2>
            <p className="mt-2 text-2xl text-[var(--studio-cyan)]">{t.price}</p>
            <p className="mt-3 text-sm text-slate-600">{t.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-slate-500">
        Method-lab experiment pricing only — soft-sim channel packs, not a live
        plant or certified CFD product.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/onboarding">Start onboarding</Link>
        </Button>
      </div>
    </StudioShell>
  );
}
