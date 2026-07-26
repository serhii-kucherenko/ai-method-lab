import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Corridor desk",
    price: "$0 lab",
    includes: ["1 org", "Demo packs", "Dual compare", "Honesty fence"],
  },
  {
    name: "Program",
    price: "$520 / seat-mo",
    includes: [
      "Corridor pack registry",
      "Corridors + treatments + assays",
      "Scoreboard + export",
      "Webhook + audit",
    ],
  },
  {
    name: "Network",
    price: "Site license",
    includes: [
      "Multi-org soft-sim",
      "Goldens browser",
      "Rate-limit controls",
      "Priority onboarding",
    ],
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for climate-road analytics leads — not live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl">{t.name}</h2>
            <p className="mt-2 text-2xl text-[var(--pr-teal)]">{t.price}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {t.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim studio only. No live road construction control, certified
        emissions audits, or municipal procurement authority.
      </p>
      <p className="mt-4 text-sm">
        <Link href="/onboarding" className="underline text-[var(--pr-teal)]">
          Start onboarding
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
