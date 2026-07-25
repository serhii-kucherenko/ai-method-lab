import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    blurb: "Soft-sim panel packs and dual compares for a single genomics team.",
  },
  {
    name: "Team",
    price: "$480 / mo",
    blurb:
      "Private panel packs, probe configs, mechanism links, members, and signed webhooks.",
  },
  {
    name: "Bench",
    price: "Talk to us",
    blurb:
      "Multi-org soft-sim benches with export and audit for clinical genomics programs.",
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab soft-sim seats — not diagnostic cleared, not live LIMS."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {t.name}
            </h2>
            <p className="mt-2 text-3xl font-semibold text-[var(--vp-teal)]">
              {t.price}
            </p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {t.blurb}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim pricing only. See{" "}
        <Link className="underline" href="/honesty">
          honesty
        </Link>{" "}
        and{" "}
        <Link className="underline" href="/onboarding">
          onboarding
        </Link>
        .
      </p>
    </StudioShell>
  );
}
