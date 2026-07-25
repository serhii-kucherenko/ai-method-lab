import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0",
    blurb: "Soft-sim packs, pillars, and dual compare for a single lab team.",
  },
  {
    name: "Team",
    price: "$480 / mo",
    blurb:
      "Org members, webhook HMAC, export, scoreboard, and multi-pack surveillance soft-sim.",
  },
  {
    name: "Program",
    price: "Talk to us",
    blurb:
      "Method-lab programs for multi-jurisdiction governance leads — still soft-sim, never certification.",
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab tiers for surveillance-governance soft-sim — not a live national deploy contract."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <article
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-white p-6"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {t.name}
            </h2>
            <p className="mt-2 text-3xl font-semibold text-[var(--sg-teal)]">
              {t.price}
            </p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {t.blurb}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm">
        Soft-sim honesty applies on every tier.{" "}
        <Link href="/honesty" className="underline text-[var(--sg-teal)]">
          Read the fence
        </Link>
        .
      </p>
    </StudioShell>
  );
}

export default PricingPage;
