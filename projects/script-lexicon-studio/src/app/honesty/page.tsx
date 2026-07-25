import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this product is — and what it is not."
    >
      <div className="space-y-4 text-stone-700">
        <p>
          <strong>Soft-sim only.</strong> Script Lexicon Studio is a method-lab
          scoring and planning surface. It does not ship production machine
          translation or claim certified translation quality.
        </p>
        <p>
          <strong>Not production MT certification.</strong> Scores are dual
          soft-sim heuristics inspired by Ge&apos;ez-script lexicon expansion
          patterns. They are not production MT benchmarks and are not certified
          for localization sign-off.
        </p>
        <p>
          <strong>Not VEXMLM and not the authors&apos; system.</strong> This
          product is inspired by arXiv{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            2607.15209
          </a>
          . It is not branded as VEXMLM and ships no authors&apos; code (none
          published).
        </p>
        <p>
          Use compares to decide whether an expanded Ge&apos;ez lexicon pack
          beats a baseline multilingual tokenizer inside this studio — then take
          further localization decisions outside the lab tool with your own
          process.
        </p>
      </div>
    </StudioShell>
  );
}
