import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    blurb: "Soft-sim materials packs and dual A/B for a single materials lead.",
  },
  {
    name: "Team",
    price: "$480/mo",
    blurb:
      "Members, webhooks, exports, and shared scoreboards for inverse-design pods.",
  },
  {
    name: "Program",
    price: "Talk to us",
    blurb:
      "Multi-site materials packs with audit trails — still method-lab soft-sim only.",
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab soft-sim seats — not a certified materials performance subscription."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {t.name}
            </h2>
            <p className="mt-2 text-2xl font-semibold text-[var(--pi-aqua)]">
              {t.price}
            </p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {t.blurb}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only. Not certified performance. Not live plant.
      </p>
    </StudioShell>
  );
}
