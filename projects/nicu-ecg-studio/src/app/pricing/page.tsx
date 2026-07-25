import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

export function PricingPage() {
  return (
    <StudioShell
      title="Pricing"
      subtitle="Method-lab packaging for neonatal ECG soft-sim — not a live checkout."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Starter</h2>
          <p className="mt-2 text-3xl font-semibold text-[var(--ne-teal)]">$0</p>
          <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
            Soft-sim ecg packs, PPG channels, and dual A/B for a single monitoring lead.
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
            <li>Ecg pack registry</li>
            <li>Alignment-free vs alignment-dependent compare</li>
            <li>Honesty fence + try.html</li>
          </ul>
        </article>
        <article className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
          <h2 className="font-[family-name:var(--font-display)] text-2xl">Team</h2>
          <p className="mt-2 text-3xl font-semibold text-[var(--ne-teal)]">Method-lab</p>
          <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
            Hypothetical seats for NICU analytics / neonatal monitoring teams.
          </p>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
            <li>Members + bearer auth</li>
            <li>Webhook HMAC + audit + export</li>
            <li>Scoreboard + goldens sample</li>
          </ul>
        </article>
      </div>
      <p className="mt-8 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
        Soft-sim only — not diagnostic, not live device write-back, not FDA cleared.
        See <Link href="/honesty" className="underline text-[var(--ne-teal)]">honesty</Link>.
      </p>
    </StudioShell>
  );
}

export default PricingPage;
