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
          Soft-sim only. Scores are method-lab proxies for unified nanoporous
          inverse design vs naive generative baselines.
        </li>
        <li>
          Not certified materials performance. Do not treat outputs as
          plant-ready or certification evidence.
        </li>
        <li>
          Not live plant. No process control write-back or plant system
          integration.
        </li>
        <li>
          Not the authors&apos; system / not PoreForge brand. Inspired by{" "}
          <a className="text-[var(--pi-aqua)] underline" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15005975
          </a>
          ; authors&apos; code: none published.
        </li>
      </ul>
    </StudioShell>
  );
}
