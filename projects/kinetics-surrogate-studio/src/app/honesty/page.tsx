import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this product is — and what it is not."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          <strong>Soft-sim only.</strong> Kinetics Surrogate Studio is a
          method-lab scoring and planning surface. It does not ship certified
          CFD solvers or claim live plant control.
        </p>
        <p>
          <strong>Not certified CFD.</strong> Scores are dual soft-sim
          heuristics inspired by entropy-constrained kinetics surrogate
          patterns. They are not production combustion benchmarks and are not
          certified for plant or safety sign-off.
        </p>
        <p>
          <strong>Not live plant and not the authors&apos; system.</strong> This
          product is inspired by arXiv{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            2607.09582
          </a>
          . It is not branded as the paper system and ships no authors&apos;
          code (none published).
        </p>
        <p>
          Use compares to decide whether an entropy-constrained surrogate pack
          beats a full-rate baseline inside this studio — then take further
          combustion decisions outside the lab tool with your own process.
        </p>
      </div>
    </StudioShell>
  );
}
