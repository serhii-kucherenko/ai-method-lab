import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Panel",
    price: "$0",
    blurb: "Single impact pack soft-sim for method-lab exploration.",
    includes: ["1 pack", "Country + antigen drafts", "Dual compare", "Honesty fence"],
  },
  {
    name: "Program",
    price: "$480 / mo",
    blurb: "Hypothetical seat pack for immunization analytics leads.",
    includes: [
      "10 packs",
      "Scoreboard + export",
      "Webhook ingest",
      "Member invite",
      "Audit trail",
    ],
  },
  {
    name: "Network",
    price: "Site license",
    blurb: "Hypothetical multi-org soft-sim for regional EPI desks.",
    includes: [
      "Unlimited packs",
      "Rate-limit controls",
      "Goldens browser",
      "Priority guide",
    ],
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab packaging only — not a live checkout. Hypothetical tiers for immunization-program analytics soft-sims."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.name}</h2>
            <p className="mt-1 text-3xl font-semibold text-[var(--ii-teal)]">{t.price}</p>
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
      <p className="mt-8 text-sm">
        <Link href="/packs" className="underline text-[var(--ii-teal)]">
          Open packs
        </Link>
        {" · "}
        <Link href="/honesty" className="underline text-[var(--ii-teal)]">
          Honesty
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
