import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "Single therapy pack soft-sim for localized nanodomain explores.",
    includes: ["1 therapy pack", "Nanodomain + peptide editors", "A/B compare"],
  },
  {
    name: "Team",
    price: "$490 / seat · hypothetical",
    blurb: "Shared packs, scoreboard, and webhook soft-sim for cardio analytics leads.",
    includes: ["Unlimited packs", "Scoreboard + export", "Members + audit"],
  },
  {
    name: "Site",
    price: "Talk to us · hypothetical",
    blurb: "Org-wide soft-sim for precision-therapy design reviews.",
    includes: ["Org settings", "Rate limits", "HMAC webhooks"],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--nt-crimson)]">
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
        Soft-sim packaging only — not wet-lab validated IND/NDA, not live patient
        dosing, not clinical heart-failure diagnosis.
      </p>
      <p className="mt-4">
        <Link href="/onboarding" className="underline text-[var(--nt-teal)]">
          Start onboarding
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
