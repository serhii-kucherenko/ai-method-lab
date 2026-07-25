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
          Molecule Sample Studio is a method-lab workspace for comparing
          sample-efficient generative optimization against naive generative
          baselines. It is not wet-lab validated, not a live ELN, and not a
          synthesis planner.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not the authors&apos; system.
          </strong>{" "}
          Inspired by arXiv{" "}
          <a className="text-[var(--ms-teal)] underline" href={PAPER_URL}>
            2607.12488
          </a>
          . Authors&apos; code: none published. This product is not branded as
          the paper&apos;s software.
        </p>
        <p>
          Scores and goldens are dual-implementation fixtures for method
          evaluation. Do not use outputs for wet-lab decisions.
        </p>
      </div>
    </StudioShell>
  );
}
