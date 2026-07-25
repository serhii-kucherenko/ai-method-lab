import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="What Encoded Library Studio is — and is not."
    >
      <ul className="list-disc space-y-3 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <li>Method-lab soft-sim for iterative DNA-encoded library construct-and-screen cycles.</li>
        <li>Not wet-lab validated IND/NDA evidence.</li>
        <li>Not live screening robotics or lab automation control.</li>
        <li>Not clinical candidate nomination.</li>
        <li>Not the authors&apos; DELT system brand.</li>
      </ul>
      <p className="mt-8 text-sm">
        Source paper:{" "}
        <a className="underline text-[var(--el-sea)]" href={PAPER_URL}>
          ChemRxiv 10.26434/chemrxiv.15004709/v2
        </a>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
