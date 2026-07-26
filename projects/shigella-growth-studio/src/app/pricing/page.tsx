import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Explorer",
    price: "$0",
    body: "Single-org soft-sim packs, 2 evaluators, offline try.html.",
  },
  {
    name: "Program",
    price: "$480/mo",
    body: "Unlimited cohort packs, webhook export, audit trail, goldens API.",
  },
  {
    name: "Network",
    price: "Talk to us",
    body: "Multi-site epidemiology networks, SSO, custom rate limits.",
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Soft-sim cohort packs for child-health epidemiology analytics leads."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white px-5 py-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.name}</h2>
            <p className="mt-2 text-3xl font-semibold text-[var(--sg-teal)]">{t.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {t.body}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8">
        <Link href="/packs" className="text-[var(--sg-teal)] underline">
          Start with packs
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
