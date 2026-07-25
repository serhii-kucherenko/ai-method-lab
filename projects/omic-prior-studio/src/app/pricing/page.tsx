import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const TIERS = [
  {
    name: "Starter",
    price: "$0 method-lab",
    blurb: "Single omic pack, dual A/B soft-sim, honesty fence.",
    includes: ["1 org", "Omic + prior + trait CRUD", "Compare + scoreboard"],
  },
  {
    name: "Team",
    price: "$ hypothetical / seat",
    blurb: "Members, webhook HMAC, export, and rate limits for multi-omics teams.",
    includes: ["Members + roles", "Audit + export", "Webhook ingest"],
  },
  {
    name: "Site",
    price: "Site license (hypothetical)",
    blurb: "Multi-pack precision-medicine soft-sim benches for a site.",
    includes: ["Many packs", "Priority soft-sim lanes", "Guide + try.html"],
  },
] as const;

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {TIERS.map((t) => (
          <div key={t.name} className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">{t.name}</h2>
            <p className="mt-1 text-sm text-[var(--op-teal)]">{t.price}</p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">{t.blurb}</p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {t.includes.map((i) => <li key={i}>{i}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim omic priors only — not diagnostic, not live EHR, not FDA, not OmicFormer.
        {" "}
        <Link href="/honesty" className="underline text-[var(--op-teal)]">Read honesty</Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
