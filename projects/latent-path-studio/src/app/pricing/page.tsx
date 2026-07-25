import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "One cohort pack, dual A/B compare, honesty fence.",
    includes: ["1 pack", "Cohorts + predictors", "Compare + scoreboard"],
  },
  {
    name: "Team",
    price: "$490 / soft-sim seat",
    blurb: "Adolescent MH analytics ops with export and webhooks.",
    includes: [
      "Unlimited packs (soft-sim)",
      "Member invite",
      "HMAC webhook + CSV/JSON export",
      "Audit trail",
    ],
  },
  {
    name: "Study license",
    price: "Talk to lab",
    blurb: "Hypothetical multi-cohort license packaging — not live checkout.",
    includes: [
      "Org settings + rate limits",
      "Guided onboarding",
      "Goldens sample API",
    ],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab tiers for multi-domain latent path soft-sim — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <article
            key={tier.name}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-6"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {tier.name}
            </h2>
            <p className="mt-2 text-lg text-[var(--lp-teal)]">{tier.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {tier.blurb}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
        Soft-sim packaging only. Not clinical diagnostic, not crisis
        intervention, not EHR write-back.{" "}
        <Link href="/honesty" className="underline text-[var(--lp-teal)]">
          Read honesty
        </Link>
        .
      </p>
    </StudioShell>
  );
}

export default PricingPage;
