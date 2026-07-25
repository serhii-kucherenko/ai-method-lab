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
          Soft-sim only. Scores are method-lab proxies for marker-free
          deformable fusion vs marker-based baselines.
        </li>
        <li>
          Not a surgical device cleared for clinical use. Do not treat outputs
          as cleared imaging software.
        </li>
        <li>
          Not live OR guidance. No intraoperative overlay or patient
          write-back.
        </li>
        <li>
          Not the authors&apos; system. Inspired by{" "}
          <a className="text-[var(--mf-cyan)] underline" href={PAPER_URL}>
            arXiv 2607.13343
          </a>
          ; authors&apos; code: none published.
        </li>
      </ul>
    </StudioShell>
  );
}
