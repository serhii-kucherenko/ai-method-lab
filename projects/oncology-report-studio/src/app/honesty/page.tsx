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
          <strong>Soft-sim only.</strong> Oncology Report Studio is a
          method-lab scoring and planning surface. It does not ship clinical
          decision support or claim live PACS integration.
        </p>
        <p>
          <strong>Not clinical decision support.</strong> Scores are dual
          soft-sim heuristics inspired by multi-LLM collaborative MRI report
          patterns. They are not production radiology benchmarks and are not
          cleared for clinical use.
        </p>
        <p>
          <strong>Not live PACS and not the authors&apos; system.</strong> This
          product is inspired by arXiv{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            2607.14581
          </a>
          . It is not branded as the paper system and ships no authors&apos;
          code (none published).
        </p>
        <p>
          Use compares to decide whether a multi-LLM collaborative draft pack
          beats a single-LLM baseline inside this studio — then take further
          imaging decisions outside the lab tool with your own process.
        </p>
      </div>
    </StudioShell>
  );
}
