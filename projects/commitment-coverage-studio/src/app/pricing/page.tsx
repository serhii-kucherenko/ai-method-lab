import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DISPLAY_NAME } from "@/lib/claim";

const SEAT_TIERS = [
  {
    name: "Evaluator seats",
    price: "$0 soft-sim",
    detail: "Try the dual claim and renewal pack on demo data.",
  },
  {
    name: "Platform seats",
    price: "$49 / seat / mo",
    detail: "FinOps leads who match commits and walk renewals weekly.",
  },
  {
    name: "Site license",
    price: "Talk to us",
    detail: "Wider org rollout with shared soft-sim workspaces.",
  },
] as const;

const ACCOUNT_TIERS = [
  {
    name: "Up to 5 connected accounts",
    price: "Included",
    detail: "AWS, GCP, and Azure soft-sim account keys.",
  },
  {
    name: "Up to 25 connected accounts",
    price: "+$199 / mo",
    detail: "Multi-cloud rollups across teams and providers.",
  },
  {
    name: "Unlimited connected accounts",
    price: "Site add-on",
    detail: "Enterprise soft-sim packaging — still not live billing SOR.",
  },
] as const;

export default function PricingPage() {
  return (
    <main className="ledger-field flex flex-1 flex-col">
      <article className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 sm:px-12 sm:py-24">
        <p className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {DISPLAY_NAME}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Pricing
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Soft-sim packaging for seats and connected-account tiers. There is no
          live card checkout — this lab does not capture payments.
        </p>

        <section className="mt-14">
          <h2 className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Seat tiers
          </h2>
          <ul className="mt-6 space-y-6">
            {SEAT_TIERS.map((tier) => (
              <li
                key={tier.name}
                className="border-t border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] pt-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-foreground">{tier.name}</p>
                  <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent)]">
                    {tier.price}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tier.detail}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="font-[family-name:var(--font-mono)] text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Connected-account tiers
          </h2>
          <ul className="mt-6 space-y-6">
            {ACCOUNT_TIERS.map((tier) => (
              <li
                key={tier.name}
                className="border-t border-[color-mix(in_srgb,var(--color-rule)_35%,transparent)] pt-6"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-foreground">{tier.name}</p>
                  <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--color-accent)]">
                    {tier.price}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tier.detail}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-12 text-sm leading-relaxed text-muted-foreground">
          Method-lab soft-sim only. Not a live billing system of record. No live
          card checkout.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/demo">Start demo</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
