import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "One cost pack, dual A/B soft-sim, honesty fence.",
    includes: ["1 cost pack", "W/E/E models", "Compare + scoreboard"],
  },
  {
    name: "Team",
    price: "Seats (hypothetical)",
    blurb: "Shared packs for sustainability + AI infra leads.",
    includes: ["Members + roles", "Audit trail", "Webhook HMAC"],
  },
  {
    name: "Site",
    price: "Site license (hypothetical)",
    blurb: "Private cost packs across regions and infra targets.",
    includes: ["Export JSON/CSV", "Rate limits", "Goldens sample API"],
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for sovereign cost soft-sim benches — not a live checkout."
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
            <p className="mt-1 text-[var(--sc-teal)]">{t.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {t.blurb}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {t.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
        Soft-sim only. Not certified carbon audits. Continue to{" "}
        <Link href="/onboarding" className="text-[var(--sc-teal)] underline">
          onboarding
        </Link>{" "}
        or{" "}
        <Link href="/costs" className="text-[var(--sc-teal)] underline">
          costs
        </Link>
        .
      </p>
    </StudioShell>
  );
}
