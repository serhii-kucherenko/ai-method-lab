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
          Soft-sim only. Scores are method-lab proxies for chemist-in-the-loop
          VLM reaction-condition agents vs open-loop VLM baselines.
        </li>
        <li>
          Not live wet-lab control. Do not treat outputs as robot recipes or
          closed-loop lab automation.
        </li>
        <li>
          Not manufacturing cleared. No GMP, scale-up, or production release
          claim.
        </li>
        <li>
          Not the authors&apos; system. Inspired by{" "}
          <a className="text-[var(--rl-teal)] underline" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15006308
          </a>
          ; authors&apos; code: none published.
        </li>
      </ul>
    </StudioShell>
  );
}
