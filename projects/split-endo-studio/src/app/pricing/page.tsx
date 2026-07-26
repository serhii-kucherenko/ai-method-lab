import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Bench",
    price: "$0 lab",
    blurb: "Single-org soft-sim packs, goldens sample, honesty fence.",
  },
  {
    name: "Spine analytics",
    price: "$480 / seat / mo",
    blurb: "Case packs, approaches, outcomes, dual compare, scoreboard, export.",
  },
  {
    name: "Site license",
    price: "Custom",
    blurb: "Multi-member org, webhooks, audit retention, rate-limit budgets.",
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl">{t.name}</h2>
            <p className="mt-2 text-2xl text-[var(--se-teal)]">{t.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {t.blurb}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/onboarding" className="underline text-[var(--se-teal)]">
          Start onboarding
        </Link>
        {" · "}
        <Link href="/honesty" className="underline text-[var(--se-teal)]">
          Honesty
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
