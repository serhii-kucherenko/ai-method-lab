import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    includes: [
      "1 detect pack",
      "Seed stigma images + CNN model",
      "Dual A/B soft-sim compare",
    ],
  },
  {
    name: "Team",
    price: "$49 / seat (hypothetical)",
    includes: [
      "Versioned detect packs",
      "Scoreboard + export",
      "Org members + audit trail",
    ],
  },
  {
    name: "Bench",
    price: "Site license (hypothetical)",
    includes: [
      "HMAC webhook ingest",
      "Rate-limit controls",
      "Goldens sample API",
    ],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab packaging for saffron detect soft-sim — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {t.name}
            </h2>
            <p className="mt-1 text-[var(--sd-teal)]">{t.price}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {t.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only — not certified lab accreditation, not customs authority.
        Hypothetical tiers for the method-lab experiment.
      </p>
      <p className="mt-4">
        <Link href="/onboarding" className="text-[var(--sd-teal)] underline">
          Continue to onboarding
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
