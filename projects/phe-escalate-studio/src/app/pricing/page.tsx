import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    includes: [
      "1 org · 3 seats",
      "Escalate packs + classifications",
      "Dual A/B soft-sim",
      "Honesty fence",
    ],
  },
  {
    name: "Team",
    price: "$490 / seat / yr (hypothetical)",
    includes: [
      "Unlimited packs",
      "Scoreboard + export",
      "Webhook HMAC + audit",
      "Member roles",
    ],
  },
  {
    name: "Site",
    price: "Custom site license",
    includes: [
      "Shared org settings",
      "Rate-limit budgets",
      "Goldens sample API",
      "Priority soft-sim review",
    ],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for PHE escalate soft-sim — not a live checkout."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.name}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {t.name}
            </h2>
            <p className="mt-1 text-sm text-[var(--pe-teal)]">{t.price}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {t.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
        Soft-sim packaging only — not operational MoH authority pricing, not
        live write-back SaaS billing.{" "}
        <Link href="/onboarding" className="text-[var(--pe-teal)] underline">
          Start onboarding
        </Link>
        .
      </p>
    </StudioShell>
  );
}

export default PricingPage;
