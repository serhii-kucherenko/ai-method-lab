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
          Assay Guard Studio is a method-lab workspace for comparing assay-aware
          protocol validation against naive protocol runners. It is not certified
          compliance, not live robot control, and not a lab OS.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not the authors&apos; system.
          </strong>{" "}
          Inspired by arXiv{" "}
          <a className="text-[var(--ag-aqua)] underline" href={PAPER_URL}>
            2607.15620
          </a>
          . Authors&apos; code: none published. This product is not branded as
          the paper&apos;s software.
        </p>
        <p>
          Scores and goldens are dual-implementation fixtures for method
          evaluation. Do not use outputs for live liquid-handling decisions.
        </p>
      </div>
    </StudioShell>
  );
}
