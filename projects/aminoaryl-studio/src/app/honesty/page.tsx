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
          Aminoaryl Studio is a method-lab soft-simulation for comparing
          photocatalytic 1,3-aminoarylation against copper-catalyzed
          aminoarylation on recorded route packs. It is inspired by a published
          ChemRxiv pattern, not an authors&apos; product brand.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not wet-lab validation</li>
          <li>Not scale-up manufacturing control</li>
          <li>Not regulatory filing authority</li>
          <li>
            Dual scorers can disagree when cyclopropane strain hides incomplete
            photocatalytic coverage that copper soft-sims may exploit — that
            disagreement is the point of the bench, not a manufacturing claim
          </li>
        </ul>
        <p>
          Research input:{" "}
          <a
            href={PAPER_URL}
            className="underline text-[var(--aa-teal)]"
            target="_blank"
            rel="noreferrer"
          >
            ChemRxiv 10.26434/chemrxiv.15005923/v1
          </a>
          . Authors&apos; code: none published.
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
