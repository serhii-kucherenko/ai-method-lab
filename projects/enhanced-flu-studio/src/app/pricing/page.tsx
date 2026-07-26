import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Pilot",
    price: "$0 method-lab",
    includes: ["1 org", "Demo pack", "30 goldens browser", "Honesty fence"],
  },
  {
    name: "Program desk",
    price: "$480 / seat / yr (hypothetical)",
    includes: [
      "Unlimited program packs",
      "Country + program workspaces",
      "Dual A/B compare",
      "Scoreboard + CSV export",
    ],
  },
  {
    name: "Agency license",
    price: "$12k / site / yr (hypothetical)",
    includes: [
      "Multi-country Nordic parity",
      "Webhook + audit",
      "Member roles",
      "Priority soft-sim review",
    ],
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical Method Lab packaging for vaccine-program analytics desks — not live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--ef-teal)]">
              {t.name}
            </h2>
            <p className="mt-2 text-sm font-medium">{t.price}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {t.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href="/onboarding" className="underline text-[var(--ef-teal)]">
          Start onboarding
        </Link>
        {" · "}
        Method-lab packaging only — not a live payment product.
      </p>
    </StudioShell>
  );
}

export default PricingPage;
