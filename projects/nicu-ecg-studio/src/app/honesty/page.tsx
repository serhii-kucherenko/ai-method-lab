import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Nicu Ecg Studio — read before locking a pack."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          This product is a method-lab soft-sim bench. It does not claim clinical
          diagnostic use, live device write-back, or FDA clearance.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use</li>
          <li>Not live device write-back or bedside monitoring control</li>
          <li>Not FDA cleared</li>
          <li>Not the authors&apos; system or paper brand</li>
          <li>Not a substitute for clinical ECG validation</li>
        </ul>
        <p>
          Dual scorers are soft-sim proxies:{" "}
          <code>alignment_free_ppg_ecg</code> vs{" "}
          <code>alignment_dependent_ppg_ecg_baseline</code>.
        </p>
        <p>
          Paper:{" "}
          <a className="underline text-[var(--ne-teal)]" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.06.26357087
          </a>{" "}
          · authors&apos; code: none published
        </p>
        <p>
          <Link href="/ecgs" className="underline text-[var(--ne-teal)]">
            Back to ecgs
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
