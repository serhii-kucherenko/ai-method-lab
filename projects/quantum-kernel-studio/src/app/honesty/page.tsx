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
          <strong>Soft-sim only.</strong> Quantum Kernel Studio is a method-lab
          scoring and planning surface. It does not run wet-lab assays or claim
          experimental binding confirmation.
        </p>
        <p>
          <strong>Not live quantum hardware.</strong> Scores are dual soft-sim
          heuristics inspired by quantum multiple-kernel learning patterns. They
          are not executed on quantum processors and are not certified for
          chemistry sign-off.
        </p>
        <p>
          <strong>Not Q²SAR and not the authors&apos; system.</strong> This
          product is inspired by arXiv{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            2607.11701
          </a>
          . It is not branded as Q²SAR and ships no authors&apos; code (none
          published).
        </p>
        <p>
          Use compares to decide whether a quantum multi-kernel pack beats a
          classical kernel baseline inside this studio — then take further
          chemistry decisions outside the lab tool with your own process.
        </p>
      </div>
    </StudioShell>
  );
}
