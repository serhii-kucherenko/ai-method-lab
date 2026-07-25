import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "Single seat soft-sim for probe pack experiments.",
    includes: ["1 org", "Probe packs + domains", "Dual A/B compare", "30 goldens sample"],
  },
  {
    name: "Team",
    price: "$490 / mo hypothetical",
    blurb: "Shared assay workspace for probe designers comparing cooperative vs melting.",
    includes: ["5 seats", "Audit + export", "Webhook ingest", "Scoreboard"],
  },
  {
    name: "Site",
    price: "Custom site license",
    blurb: "Org-wide soft-sim bench for nucleic acid detection design reviews.",
    includes: ["Unlimited packs", "Rate-limit controls", "Member roles", "Guide + try.html"],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell title="Pricing" subtitle="Hypothetical method-lab tiers for Probe Domain Studio — not live checkout.">
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((tier) => (
          <article key={tier.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{tier.name}</h2>
            <p className="mt-1 text-[var(--pd-teal)]">{tier.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{tier.blurb}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {tier.includes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim packaging only — not wet-lab validated IVD, not a whole-blood device, not live billing.
        {" "}
        <Link href="/honesty" className="underline text-[var(--pd-teal)]">Read honesty</Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
