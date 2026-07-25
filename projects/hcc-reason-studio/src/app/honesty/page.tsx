import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this soft-sim is — and what it is not."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          <strong className="text-[var(--studio-ink)]">Soft-sim only.</strong>{" "}
          HCC Reason Studio is a method-lab workspace for comparing
          clinical-reasoning LLM pathways against non-reasoning baselines. It is
          not clinical decision support (CDS), not FDA cleared, and not live EHR
          write-back.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not the authors&apos; system.
          </strong>{" "}
          Inspired by arXiv{" "}
          <a className="text-[var(--hr-wine)] underline" href={PAPER_URL}>
            2607.08602
          </a>
          . Authors&apos; code: none published. This product is not branded as
          the paper&apos;s software.
        </p>
        <p>
          Scores and goldens are dual-implementation fixtures for method
          evaluation. Do not use outputs for patient care.
        </p>
      </div>
    </StudioShell>
  );
}
