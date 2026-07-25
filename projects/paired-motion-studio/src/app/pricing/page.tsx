import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  [
    "Starter",
    "$0",
    "One paired-motion workspace",
    "Capture packs, wearers, observers, and soft-sim comparison",
  ],
  [
    "Team",
    "$49 / month",
    "Shared capture-pack decisions",
    "Members, audits, exports, and webhook integration",
  ],
  [
    "Site",
    "Talk to us",
    "Cross-team method-lab governance",
    "Custom onboarding and organization controls",
  ],
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab tooling for paired HMD motion capture decisions."
    >
      <div className="grid gap-5 md:grid-cols-3">
        {TIERS.map(([name, price, summary, features]) => (
          <article key={name} className="rounded-lg border bg-white p-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl">
              {name}
            </h2>
            <p className="mt-3 text-2xl font-semibold">{price}</p>
            <p className="mt-5">{summary}</p>
            <p className="mt-3 text-sm text-slate-600">{features}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 max-w-3xl text-sm text-slate-600">
        All tiers are method-lab tooling: scores are soft simulations, not live
        HMD fleet control, production mocap suit replacement, Meta/Aria
        deployment, or the EgoExoMoCap brand.
      </p>
    </StudioShell>
  );
}

export default PricingPage;
