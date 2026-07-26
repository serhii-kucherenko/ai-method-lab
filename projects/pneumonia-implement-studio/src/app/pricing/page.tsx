import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Soft-sim seats for implementation analytics teams — not clinical licenses."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            name: "Pilot",
            price: "$0",
            blurb: "One district pack, dual compare, offline try.html.",
          },
          {
            name: "Program",
            price: "$480 / mo",
            blurb: "Multi-district packs, fidelity runs, export + webhook.",
          },
          {
            name: "Network",
            price: "Talk to us",
            blurb: "Org members, audit trail, rate limits, scoreboard.",
          },
        ].map((tier) => (
          <div key={tier.name} className="rounded-lg border bg-white p-6">
            <h2 className="font-[family-name:var(--font-display)] text-2xl">
              {tier.name}
            </h2>
            <p className="mt-2 text-3xl font-semibold text-[var(--pi-teal)]">
              {tier.price}
            </p>
            <p className="mt-3 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {tier.blurb}
            </p>
          </div>
        ))}
      </div>
      <p className="mt-8">
        <Link href="/packs" className="text-[var(--pi-teal)] underline">
          Open packs
        </Link>{" "}
        to start a soft-sim pilot.
      </p>
    </StudioShell>
  );
}

export default PricingPage;
