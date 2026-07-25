import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this product is — and what it is not."
    >
      <div className="space-y-4 text-slate-700">
        <p>
          <strong>Soft-sim only.</strong> Drag Wall Studio is a method-lab
          scoring and planning surface. It does not command a live plant, PLC,
          or wall-actuation hardware.
        </p>
        <p>
          <strong>Not certified CFD.</strong> Scores are dual soft-sim
          heuristics inspired by evolution-strategy closed-loop wall control
          patterns. They are not validated CFD solvers and are not certified
          for engineering sign-off.
        </p>
        <p>
          <strong>Not the authors&apos; system.</strong> This product is
          inspired by arXiv{" "}
          <a className="text-[var(--studio-cyan)] underline" href={PAPER_URL}>
            2607.12626
          </a>
          . It is not branded as the paper system and ships no authors&apos;
          code (none published).
        </p>
        <p>
          Use compares to decide whether an ES closed-loop pack beats an
          open-loop/gradient baseline inside this studio — then take further
          plant decisions outside the lab tool with your own safety process.
        </p>
      </div>
    </StudioShell>
  );
}
