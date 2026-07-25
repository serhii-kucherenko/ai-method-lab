import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab packaging for PV causal soft-sim — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Starter</h2>
          <p className="mt-2 text-3xl font-semibold text-[var(--pc-teal)]">$0</p>
          <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
            Soft-sim pv packs, cohorts, exposures, and dual A/B for a single RWE lead.
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
            <li>Pv pack / signals registry</li>
            <li>Target-trial vs spontaneous-reporting compare</li>
            <li>Honesty fence + try.html</li>
          </ul>
        </article>
        <article className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Team</h2>
          <p className="mt-2 text-3xl font-semibold text-[var(--pc-teal)]">Method-lab</p>
          <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
            Hypothetical seats for pharmacovigilance / RWE analytics teams.
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
            <li>Members + bearer auth</li>
            <li>Webhook HMAC + audit + export</li>
            <li>Scoreboard + goldens sample</li>
          </ul>
        </article>
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only — not regulatory submission, not live claims write-back, not FDA cleared.
        See <Link href="/honesty" className="underline text-[var(--pc-teal)]">honesty</Link>.
      </p>
    </StudioShell>
  );
}

export default PricingPage;
