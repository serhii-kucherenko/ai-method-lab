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
          <strong>Soft-sim only.</strong> Federated CVD Studio is a method-lab
          scoring and planning surface. It does not ship FDA-cleared software
          or claim live EHR write-back.
        </p>
        <p>
          <strong>Not FDA cleared.</strong> Scores are dual soft-sim heuristics
          inspired by federated deep learning for privacy-preserving CVD risk
          prediction. They are not production clinical benchmarks and are not
          cleared for clinical use.
        </p>
        <p>
          <strong>Not live EHR and not the authors&apos; system.</strong> This
          product is inspired by arXiv{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            2607.08595
          </a>
          . It is not branded as the paper system and ships no authors&apos;
          code (none published).
        </p>
        <p>
          Use compares to decide whether a federated CVD risk pack beats a
          centralized baseline inside this studio — then take further clinical
          decisions outside the lab tool with your own process.
        </p>
      </div>
    </StudioShell>
  );
}
