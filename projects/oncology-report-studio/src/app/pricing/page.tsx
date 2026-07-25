import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    detail:
      "Case packs, report schemas, collaborators, and dual goldens for method-lab soft-sim.",
  },
  {
    name: "Team",
    price: "$49 / seat",
    detail: "Org members, webhook HMAC, export, audit trail, and scoreboard shares.",
  },
  {
    name: "Imaging review",
    price: "Custom",
    detail:
      "Private report packs and review seats — still soft-sim, never clinical decision support.",
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Bench seats for imaging teams comparing multi-LLM collaborative drafts."
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
            <p className="mt-2 text-2xl text-[var(--or-teal)]">{t.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {t.detail}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Method-lab experiment pricing only — soft-sim report packs, not a
        clinical decision support product.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/onboarding">Start onboarding</Link>
        </Button>
      </div>
    </StudioShell>
  );
}
