import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export function HonestyPage() {
  return (
    <StudioShell title="Honesty fence" subtitle="Soft-sim boundaries for Access Equity Studio.">
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>This product is a <strong>soft-sim</strong> method-lab bench. It does not diagnose autism, write back to live EHR systems, claim FDA clearance, or replace clinical diagnostic pathways.</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use</li>
          <li>Not live EHR write-back</li>
          <li>Not FDA clearance</li>
          <li>Not an autism diagnosis product</li>
          <li>Not the authors&apos; review brand</li>
        </ul>
        <p>Dual scorers compare <code>equity_access_task_sharing</code> against <code>accuracy_only_classifier</code> for autism digital screening decision support in simulation only.</p>
        <p className="text-sm">Paper: <a className="underline text-[var(--ae-teal)]" href={PAPER_URL}>Frontiers DOI 10.3389/fpubh.2026.1898818</a> · authors&apos; code: none · <Link href="/" className="underline text-[var(--ae-teal)]">Back home</Link></p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
