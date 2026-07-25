import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "Method-lab seat",
    blurb: "One evaluator seat, library packs, and dual A/B soft-sim compares.",
  },
  {
    name: "Team",
    price: "Lab cohort",
    blurb: "Shared packs, construct cycles, hit shortlists, export, and webhook.",
  },
  {
    name: "Site",
    price: "Site license (hypothetical)",
    blurb: "Org members, audit trail, scoreboard, and rate-limited API access.",
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for DELT chemistry analytics leads — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.name}</h2>
            <p className="mt-1 text-sm text-[var(--el-sea)]">{t.price}</p>
            <p className="mt-3 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{t.blurb}</p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only. Not wet-lab validated IND/NDA. Not live screening robotics. Not clinical candidate nomination.
      </p>
      <p className="mt-4">
        <Link href="/packs" className="underline text-[var(--el-sea)]">
          Open packs
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
