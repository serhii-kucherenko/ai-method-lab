import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Idia Quant Studio — method-lab only."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          This product is a <strong>soft-sim</strong> bench inspired by informed
          DIA single-cell proteomics research. It is{" "}
          <strong>not wet-lab validated proteomics</strong>,{" "}
          <strong>not live instrument write-back</strong>, and{" "}
          <strong>not the authors&apos; system</strong>.
        </p>
        <p>
          Dual scorers <code>informed_dia_quant</code> (A) and{" "}
          <code>naive_dia_baseline</code> (B) are deterministic soft-sim
          functions for pack-lock decisions in the Method Lab — not production
          mass-spec pipelines.
        </p>
        <p>
          Source paper:{" "}
          <a className="text-[var(--iq-teal)] underline" href={PAPER_URL}>
            bioRxiv 10.1101/2025.05.30.656945
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Continue to{" "}
          <Link href="/flows" className="text-[var(--iq-teal)] underline">
            flows
          </Link>{" "}
          or{" "}
          <Link href="/quants" className="text-[var(--iq-teal)] underline">
            quants
          </Link>
          .
        </p>
      </div>
    </StudioShell>
  );
}
