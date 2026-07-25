import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 / method-lab",
    blurb: "Soft-sim accel packs for a single evaluator seat.",
    includes: [
      "Accel pack registry",
      "Channel + representation workspace",
      "Dual A/B compare",
      "Honesty fence",
    ],
  },
  {
    name: "Team",
    price: "$480 / seat / mo (hypothetical)",
    blurb: "Shared org, members, audit, and export for biomarker leads.",
    includes: [
      "Everything in Starter",
      "Org members + roles",
      "Audit trail + CSV/JSON export",
      "HMAC webhook ingest",
      "Rate-limit feedback",
    ],
  },
  {
    name: "Site",
    price: "Custom site license (hypothetical)",
    blurb: "Multi-pack labs with scoreboard and guided onboarding.",
    includes: [
      "Everything in Team",
      "Scoreboard across packs",
      "Onboarding checklist",
      "Priority soft-sim goldens",
    ],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab packaging only — not a live checkout. Soft-sim accel packs for digital biomarker leads."
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
            <p className="mt-1 text-sm font-medium text-[var(--ap-teal)]">
              {t.price}
            </p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
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
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only — not clinical diagnostic use, not live device write-back,
        not FDA cleared.{" "}
        <Link href="/honesty" className="underline text-[var(--ap-teal)]">
          Read honesty
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
