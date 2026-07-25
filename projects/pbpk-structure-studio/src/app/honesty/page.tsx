import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this soft-sim is — and what it is not."
    >
      <ul className="list-disc space-y-3 pl-5 text-sm leading-relaxed">
        <li>
          Soft-sim only. Scores are method-lab proxies for structure-only
          topology-compiled PBPK vs measured-lab baselines.
        </li>
        <li>
          Not a regulatory PK filing. Do not treat outputs as submission-ready
          PBPK evidence.
        </li>
        <li>
          Not live LIMS. No assay write-back or laboratory system integration.
        </li>
        <li>
          Not the authors&apos; system / not Sisyphus brand. Inspired by{" "}
          <a className="text-[var(--pb-teal)] underline" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15004452
          </a>
          ; authors&apos; code: none published.
        </li>
      </ul>
    </StudioShell>
  );
}
