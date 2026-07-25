import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "One exemplar pack, dual A/B soft-sim, honesty fence.",
    includes: ["1 exemplar pack", "ROI configs", "Compare + scoreboard"],
  },
  {
    name: "Team",
    price: "Seats (hypothetical)",
    blurb: "Shared packs for imaging-AI and VLM product leads.",
    includes: ["Members + roles", "Audit trail", "Webhook HMAC"],
  },
  {
    name: "Site",
    price: "Site license (hypothetical)",
    blurb: "Private exemplar packs across modalities and sites.",
    includes: ["Export JSON/CSV", "Rate limits", "Goldens sample API"],
  },
] as const;

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for ROI exemplar soft-sim benches — not a live checkout."
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
            <p className="mt-1 text-[var(--re-coral)]">{t.price}</p>
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
        Soft-sim only. Not clinical diagnostic use. Continue to{" "}
        <Link href="/onboarding" className="text-[var(--re-coral)] underline">
          onboarding
        </Link>{" "}
        or{" "}
        <Link href="/exemplars" className="text-[var(--re-coral)] underline">
          exemplars
        </Link>
        .
      </p>
    </StudioShell>
  );
}
