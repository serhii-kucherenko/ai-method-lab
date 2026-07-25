import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "One label pack, seed precursors, and A/B compare for soft-sim.",
    includes: ["1 label pack", "Precursor + exchange workspace", "Dual A/B compare"],
  },
  {
    name: "Team",
    price: "$480 / seat / mo (hypothetical)",
    blurb: "Scoreboard, audit export, and webhook ingest for PET chemistry leads.",
    includes: [
      "Unlimited soft-sim packs",
      "Scoreboard + CSV export",
      "HMAC webhook + member invite",
    ],
  },
  {
    name: "Site",
    price: "Talk to method-lab",
    blurb: "Org-wide label bias defaults and rate-limit budgets for analytics orgs.",
    includes: ["Org settings", "Rate-limit budgets", "Guide + honesty fence"],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for fluorine-18 labeling soft-sim — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--fl-cobalt)]">
              {tier.name}
            </h2>
            <p className="mt-1 text-sm font-medium">{tier.price}</p>
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
        Soft-sim only — not GMP batch release, not live cyclotron control, not
        clinical PET dosing.{" "}
        <Link href="/honesty" className="underline text-[var(--fl-cobalt)]">
          Read honesty
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
