import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "Single atlas pack, dual A/B soft-sim, honesty fence.",
    includes: [
      "1 atlas pack",
      "Registration + quantification workspace",
      "Integrated vs fragmented compare",
      "Offline try.html",
    ],
  },
  {
    name: "Team",
    price: "$480 / seat / yr (hypothetical)",
    blurb: "Multi-pack registry, scoreboard, export, webhook HMAC.",
    includes: [
      "Unlimited soft-sim packs",
      "Org members + bearer auth",
      "Audit trail + CSV/JSON export",
      "Rate-limit feedback",
    ],
  },
  {
    name: "Site",
    price: "Talk to lab (hypothetical)",
    blurb: "Site license for neuroimaging / histology atlas eval benches.",
    includes: [
      "Shared scoreboard",
      "Webhook ingest",
      "Onboarding checklist",
      "Guide + goldens suite",
    ],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab tiers for atlas soft-sim — not a live checkout."
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
            <p className="mt-1 text-sm text-[var(--af-teal)]">{t.price}</p>
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
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim packaging only — not live microscope control, not clinical
        diagnostic use, not FDA cleared.
      </p>
      <p className="mt-4">
        <Link href="/onboarding" className="underline text-[var(--af-teal)]">
          Start onboarding
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
