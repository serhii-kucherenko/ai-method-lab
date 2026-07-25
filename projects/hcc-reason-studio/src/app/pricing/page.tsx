import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    blurb: "Soft-sim pathway packs and dual A/B for a single hepatology team.",
    points: [
      "Pathway packs + risk schemas",
      "Clinical reasoner configs",
      "30 dual goldens sample",
    ],
  },
  {
    name: "Team",
    price: "$480/mo",
    blurb: "Shared reasoners, export, webhook, and member roles for eval rings.",
    points: [
      "Members + audit trail",
      "HMAC webhook + export",
      "Compare scoreboard",
    ],
  },
  {
    name: "Enterprise",
    price: "Talk",
    blurb: "Method-lab soft-sim for multi-site hepatology pathway programs.",
    points: [
      "Rate-limit controls",
      "Bearer org tokens",
      "Custom pathway scopes",
    ],
  },
];

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab soft-sim tiers — not CDS clearance pricing."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {tier.name}
            </h2>
            <p className="mt-2 text-3xl font-semibold text-[var(--hr-wine)]">
              {tier.price}
            </p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {tier.blurb}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {tier.points.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only. See{" "}
        <Link href="/honesty" className="underline text-[var(--hr-wine)]">
          honesty
        </Link>{" "}
        and{" "}
        <Link href="/onboarding" className="underline text-[var(--hr-wine)]">
          onboarding
        </Link>
        .
      </p>
    </StudioShell>
  );
}
