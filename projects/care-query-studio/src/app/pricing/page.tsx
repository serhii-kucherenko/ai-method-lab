import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    includes: [
      "1 query pack",
      "2 locale suites",
      "Soft-sim dual A/B",
      "Honesty fence",
    ],
  },
  {
    name: "Team",
    price: "$490 / seat (hypothetical)",
    includes: [
      "Unlimited query packs",
      "Multilingual locale workspace",
      "Scoreboard + export",
      "Members + webhook HMAC",
    ],
  },
  {
    name: "Site",
    price: "Site license (hypothetical)",
    includes: [
      "Org-wide bearer auth",
      "Audit trail",
      "Rate-limit controls",
      "Goldens sample API",
    ],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for care-query soft-sim — not a live checkout."
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
            <p className="mt-1 text-[var(--cq-teal)]">{t.price}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {t.includes.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only. Not clinical diagnostic use. Not live EHR write-back. Not
        FDA cleared. Not NigBench.
      </p>
      <p className="mt-4">
        <Link href="/queries" className="underline text-[var(--cq-teal)]">
          Open queries
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
