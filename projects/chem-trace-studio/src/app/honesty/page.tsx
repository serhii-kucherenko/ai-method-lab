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
          Soft-sim only. Scores are method-lab proxies for typed trace-state
          validated agentic chemistry workflows vs ungated agent baselines.
        </li>
        <li>
          Not certified compliance. Do not treat outputs as audit-ready or
          certification evidence.
        </li>
        <li>
          Not live HPC. No cluster write-back or production scheduler
          integration.
        </li>
        <li>
          Not the authors&apos; system. Inspired by{" "}
          <a className="text-[var(--ct-teal)] underline" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15006307
          </a>
          ; authors&apos; code: none published.
        </li>
      </ul>
    </StudioShell>
  );
}
