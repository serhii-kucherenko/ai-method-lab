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
          Dhodh Screen Studio is a method-lab soft-simulation for comparing
          structure-based PfDHODH virtual screening against naive library
          baselines on recorded screen packs. It is inspired by a published
          ChemRxiv pattern, not an authors&apos; product brand.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not wet-lab validation</li>
          <li>Not clinical antimalarial advice</li>
          <li>Not IND/NDA readiness</li>
          <li>Not live compound procurement</li>
          <li>
            Dual scorers can disagree when non-selective lookalikes inflate
            naive library hits that docking plus pharmacophore would filter —
            that disagreement is the point of the bench, not a clinical claim
          </li>
        </ul>
        <p>
          Research input:{" "}
          <a
            href={PAPER_URL}
            className="underline text-[var(--ds-teal)]"
            target="_blank"
            rel="noreferrer"
          >
            ChemRxiv 10.26434/chemrxiv.15005938/v1
          </a>
          . Authors&apos; code: none published.
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
