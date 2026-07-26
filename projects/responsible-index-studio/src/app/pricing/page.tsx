import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Probe",
    price: "$0 lab",
    body: "Single org soft-sim · packs · countries · dimensions · indicators · compare",
  },
  {
    name: "Policy desk",
    price: "$480 / seat / yr",
    body: "Scoreboard · export · webhook · members · goldens browser",
  },
  {
    name: "Network",
    price: "Site license",
    body: "Multi-cohort country budgets · audit · rate limits · custom scoring bias",
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging — not live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white px-5 py-6">
            <p className="text-sm text-[var(--ri-amber)]">{t.name}</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">
              {t.price}
            </p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {t.body}
            </p>
          </div>
        ))}
      </div>
    </StudioShell>
  );
}

export default PricingPage;
