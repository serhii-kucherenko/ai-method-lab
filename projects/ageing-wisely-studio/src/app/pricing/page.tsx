import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Pilot desk",
    price: "$0 method-lab",
    includes: ["1 care pack", "Dual A/B soft-sim", "Honesty fence", "try.html"],
  },
  {
    name: "Care analytics",
    price: "$1.2k / seat / yr (hypothetical)",
    includes: ["Unlimited packs", "Cohorts + modules + sessions", "Scoreboard", "Export JSON/CSV"],
  },
  {
    name: "Delivery network",
    price: "Site license (hypothetical)",
    includes: ["Org members", "HMAC webhooks", "Audit trail", "Rate limits"],
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for geriatric digital mental-health analytics — not live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{tier.name}</h2>
            <p className="mt-2 text-[var(--aw-sage)]">{tier.price}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/onboarding" className="underline text-[var(--aw-sage)]">
          Start onboarding
        </Link>
        {" · "}
        <Link href="/honesty" className="underline text-[var(--aw-sage)]">
          Read honesty
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
