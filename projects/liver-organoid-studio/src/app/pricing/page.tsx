import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    seats: "1 seat",
    includes: [
      "Model pack registry",
      "Lineage + assay soft-sim",
      "Dual HLO vs HLC compare",
    ],
  },
  {
    name: "Team",
    price: "$490 / mo hypothetical",
    seats: "10 seats",
    includes: [
      "Everything in Starter",
      "MASLD phenotype cases",
      "Scoreboard + export",
      "Webhook ingest",
    ],
  },
  {
    name: "Site",
    price: "Custom site license",
    seats: "Org-wide",
    includes: [
      "Everything in Team",
      "Audit trail + member roles",
      "Rate-limit budgets",
      "Priority soft-sim packs",
    ],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for organoid-platform / MASLD screening teams — not live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--lo-rust)]">
              {tier.name}
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {tier.price} · {tier.seats}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
        Soft-sim only — not organoid GMP manufacture, not transplant, not
        clinical MASLD diagnosis.{" "}
        <Link href="/onboarding" className="underline text-[var(--lo-teal)]">
          Start onboarding
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
