import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "Single gel pack soft-sim · dual A/B compares · honesty fence",
    includes: [
      "1 gel pack workspace",
      "Gels / charges / salts registry",
      "Dynamic vs fixed-charge compare",
      "Offline try.html",
    ],
  },
  {
    name: "Team",
    price: "$480 / seat / yr (hypothetical)",
    blurb: "Shared packs, audit export, and webhook ingest for analytics leads",
    includes: [
      "Versioned gel packs",
      "Scoreboard + batch compares",
      "Org members + bearer auth",
      "JSON / CSV export",
      "HMAC webhook",
    ],
  },
  {
    name: "Site",
    price: "Site license (hypothetical)",
    blurb: "Materials / soft-matter electrolyte analytics org rollout",
    includes: [
      "Multi-pack soft-sim programs",
      "Rate-limit budgets",
      "Audit trail retention",
      "Onboarding checklist coaching",
    ],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for hydrogel ion-transport soft-sim — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ih-sea)]">
              {tier.name}
            </h2>
            <p className="mt-1 text-sm font-medium text-[var(--ih-copper)]">
              {tier.price}
            </p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {tier.blurb}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim packaging only — not wet-lab validated membrane manufacturing,
        not live plant ionics, not commercial battery cell qualification.
      </p>
      <Link href="/onboarding" className="mt-4 inline-block">
        <Button type="button">Start onboarding</Button>
      </Link>
    </StudioShell>
  );
}

export default PricingPage;
