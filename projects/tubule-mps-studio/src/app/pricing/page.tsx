import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Bench",
    price: "$0",
    note: "Method-lab packaging — not live checkout",
    includes: ["1 org", "Seed tubule pack", "Dual soft-sim compares", "Goldens sample"],
  },
  {
    name: "Site",
    price: "$2.4k / yr",
    note: "Hypothetical site license for MPS analytics leads",
    includes: [
      "Unlimited packs",
      "Export JSON/CSV",
      "Webhook ingest",
      "Member invite",
      "Scoreboard",
    ],
  },
  {
    name: "Network",
    price: "Custom",
    note: "Multi-site soft-sim network — still not wet-lab validated",
    includes: [
      "Multi-org settings",
      "Rate-limit budgets",
      "Audit trail",
      "Priority guide support",
    ],
  },
];

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical plans aligned to transplant / MPS analytics buyers — not a live payment rail."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border bg-white px-5 py-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.name}</h2>
            <p className="mt-2 text-3xl font-semibold text-[var(--tm-teal)]">{t.price}</p>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {t.note}
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
        Ready to try?{" "}
        <Link href="/packs" className="underline text-[var(--tm-teal)]">
          Open packs
        </Link>{" "}
        or{" "}
        <Link href="/demo" className="underline text-[var(--tm-teal)]">
          run the demo
        </Link>
        .
      </p>
    </StudioShell>
  );
}

export default PricingPage;
