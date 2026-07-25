import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Sepsis Therapy Studio — read before locking a pack."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          This product is a method-lab soft-sim bench. It does not claim clinical
          diagnostic use, live EHR write-back, or FDA clearance.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use</li>
          <li>Not live EHR write-back or order entry</li>
          <li>Not FDA cleared</li>
          <li>Not the authors&apos; system or paper brand</li>
          <li>Not a substitute for formal critical-care validation</li>
        </ul>
        <p>
          Dual scorers are soft-sim proxies:{" "}
          <code>ct_hmm_therapy_effectiveness</code> vs{" "}
          <code>static_guideline_baseline</code>.
        </p>
        <p>
          Paper:{" "}
          <a className="underline text-[var(--st-teal)]" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.03.26357092
          </a>{" "}
          · authors&apos; code: none published
        </p>
        <p>
          <Link href="/therapies" className="underline text-[var(--st-teal)]">
            Back to therapies
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
