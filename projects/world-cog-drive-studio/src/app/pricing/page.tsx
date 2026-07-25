import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab soft-sim seats for autonomy leads — not certified AV."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Starter
          </h2>
          <p className="mt-2 text-3xl font-semibold">$0</p>
          <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            Soft-sim route packs, world forecasts, and dual compares for one
            evaluator.
          </p>
          <Button asChild className="mt-4">
            <Link href="/onboarding">Start onboarding</Link>
          </Button>
        </div>
        <div className="rounded-lg border border-[var(--wc-amber)] bg-[var(--studio-panel)] p-6 shadow-sm">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Team
          </h2>
          <p className="mt-2 text-3xl font-semibold">$49</p>
          <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            Shared packs, member invite, webhook HMAC, export, and scoreboard
            for autonomy leads.
          </p>
          <Button asChild className="mt-4">
            <Link href="/routes">Open routes</Link>
          </Button>
        </div>
        <div className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">
            Bench
          </h2>
          <p className="mt-2 text-3xl font-semibold">Custom</p>
          <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
            Private soft-sim benches with rate limits and audit for labs
            comparing world-cognitive vs single-level VLA.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/honesty">Read honesty fence</Link>
          </Button>
        </div>
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Prices are method-lab experiment placeholders. Soft-sim only — not
        certified AV, not live vehicle control.
      </p>
    </StudioShell>
  );
}
