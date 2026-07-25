import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Pv Causal Studio — read before locking a pack."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          This product is a method-lab soft-sim bench. It does not claim regulatory
          submission authority, live claims write-back, or FDA clearance.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not regulatory submission authority</li>
          <li>Not live claims write-back or safety database control</li>
          <li>Not FDA cleared</li>
          <li>Not the authors&apos; system or paper brand</li>
          <li>Not a substitute for formal pharmacovigilance validation</li>
        </ul>
        <p>
          Dual scorers are soft-sim proxies:{" "}
          <code>target_trial_causal_signal</code> vs{" "}
          <code>spontaneous_reporting_baseline</code>.
        </p>
        <p>
          Paper:{" "}
          <a className="underline text-[var(--pc-teal)]" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.01.26356874
          </a>{" "}
          · authors&apos; code: none published
        </p>
        <p>
          <Link href="/signals" className="underline text-[var(--pc-teal)]">
            Back to signals
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
