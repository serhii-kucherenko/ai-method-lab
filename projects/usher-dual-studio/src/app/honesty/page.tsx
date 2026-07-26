import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="What this soft-sim studio is — and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Usher Dual Studio is a method-lab soft-simulation for comparing MYO7A
          gene supplementation against Myo7b activation on recorded allele packs.
          It is inspired by a published Usher 1B pathway pattern, not an
          authors&apos; product brand.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not wet-lab validation</li>
          <li>Not IND/NDA readiness</li>
          <li>Not patient dosing</li>
          <li>Not clinical gene-therapy advice</li>
          <li>
            Dual scorers can disagree when allele gaps hide incomplete MYO7A
            coverage that Myo7b activation soft-sims may exploit — that
            disagreement is the point of the bench, not a clinical claim
          </li>
        </ul>
        <p>
          Research input:{" "}
          <a
            href={PAPER_URL}
            className="underline text-[var(--ud-teal)]"
            target="_blank"
            rel="noreferrer"
          >
            bioRxiv 10.64898/2026.07.02.736025
          </a>
          . Authors&apos; code: none published.
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
