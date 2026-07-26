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
          Tubule Mps Studio is a method-lab soft-simulation for comparing
          voclosporin mitochondrial preservation against cyclosporine A baselines
          on recorded proximal-tubule packs. It is inspired by a published MPS
          pattern, not an authors&apos; product brand.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not wet-lab MPS validation</li>
          <li>Not transplant dosing advice</li>
          <li>Not IND/NDA readiness</li>
          <li>Not live patient care</li>
          <li>
            Dual scorers can disagree when 2D culture masking hides cyclosporine
            harm that MPS soft-sims would surface — that disagreement is the
            point of the bench, not a clinical claim
          </li>
        </ul>
        <p>
          Research input:{" "}
          <a
            href={PAPER_URL}
            className="underline text-[var(--tm-teal)]"
            target="_blank"
            rel="noreferrer"
          >
            bioRxiv 10.64898/2026.07.07.737071
          </a>
          . Authors&apos; code: none published.
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
