import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Surveillance desk",
    price: "$0 method-lab",
    blurb: "Single-org soft-sim packs, scenarios, and dual compare.",
    includes: ["Risk packs", "CMIP6 scenarios", "A/B compare", "Honesty fence"],
  },
  {
    name: "Regional bench",
    price: "$ hypothetical / seat",
    blurb: "Multi-member invites, webhook export, scoreboard for climate leads.",
    includes: ["Everything in desk", "Members + audit", "CSV/JSON export", "Webhook ingest"],
  },
  {
    name: "National soft-sim",
    price: "Site license (hypothetical)",
    blurb: "Broader grid budgets and org rate limits for surveillance programs.",
    includes: ["Everything in regional", "Higher rate limits", "Goldens sample API", "Priority guide link"],
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical Method Lab packaging for dengue thermal-suitability soft-sim — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl">{tier.name}</h2>
            <p className="mt-1 text-sm text-[var(--ds-teal)]">{tier.price}</p>
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
      <p className="mt-8 text-sm">
        <Link href="/onboarding" className="underline text-[var(--ds-teal)]">
          Start onboarding
        </Link>
        {" · "}
        <Link href="/honesty" className="underline text-[var(--ds-teal)]">
          Read honesty
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
