import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    detail:
      "Language packs, lexicons, tokenizers, and dual goldens for method-lab soft-sim.",
  },
  {
    name: "Team",
    price: "$49 / seat",
    detail: "Org members, webhook HMAC, export, audit trail, and scoreboard shares.",
  },
  {
    name: "Localization review",
    price: "Custom",
    detail:
      "Private language packs and review seats — still soft-sim, never production MT certification.",
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Bench seats for NLP teams comparing expanded Ge'ez lexicon plans."
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
            <p className="mt-2 text-2xl text-[var(--studio-teal)]">{t.price}</p>
            <p className="mt-3 text-sm text-stone-600">{t.detail}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-stone-500">
        Method-lab experiment pricing only — soft-sim language packs, not a
        production MT certification product.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/onboarding">Start onboarding</Link>
        </Button>
      </div>
    </StudioShell>
  );
}
