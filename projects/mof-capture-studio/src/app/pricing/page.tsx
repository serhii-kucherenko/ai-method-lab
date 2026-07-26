import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Hypothetical method-lab packaging for remediation materials teams — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            name: "Site bench",
            price: "$0 / lab",
            blurb: "Single water pack, local soft-sim compares, try.html offline.",
            items: ["1 water pack", "Dual scorers", "Scoreboard"],
          },
          {
            name: "Remediation team",
            price: "$480 / seat / yr",
            blurb: "Sorbents + assays workspace, export, webhook soft-sim.",
            items: ["Unlimited packs", "Org members", "Audit + export"],
          },
          {
            name: "Network license",
            price: "Custom",
            blurb: "Multi-site water cohorts with rate limits and HMAC webhooks.",
            items: ["Multi-org soft-sim", "Goldens browser", "Priority guide"],
          },
        ].map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl text-[var(--mc-teal)]">
              {tier.name}
            </h2>
            <p className="mt-2 text-xl font-semibold">{tier.price}</p>
            <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {tier.blurb}
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
              {tier.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim packaging only. Not live plant control, certified water audits,
        or municipal procurement.{" "}
        <Link href="/onboarding" className="underline text-[var(--mc-teal)]">
          Start onboarding
        </Link>
      </p>
    </StudioShell>
  );
}

export default PricingPage;
