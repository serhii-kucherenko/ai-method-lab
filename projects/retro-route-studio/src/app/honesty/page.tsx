import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim synthesis-planning product — read before treating scores as wet-lab truth."
    >
      <div className="max-w-2xl space-y-4 text-slate-700">
        <p>
          <strong>{DISPLAY_NAME}</strong> is a soft-sim chem / synthesis-planning
          studio inspired by structured-memory retrosynthesis research. Scores
          are workflow experiments, not lab execution measurements.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Not RetroAgent and not an official rebrand of that system.
          </li>
          <li>Not wet-lab execution or robotic synthesis control.</li>
          <li>Not regulatory synthesis certification or CMC approval.</li>
          <li>
            Dual score A = structured-memory agentic planning; B = naive local
            greedy search — for falsification, not batch release.
          </li>
        </ul>
        <h2 className="pt-4 font-[family-name:var(--font-display)] text-xl text-slate-900">
          Sources
        </h2>
        <ul className="space-y-1 text-sm">
          <li>
            Paper:{" "}
            <a className="text-[var(--studio-teal)] underline" href={PAPER_URL}>
              {PAPER_URL}
            </a>
          </li>
          <li>Authors&apos; code: none published</li>
        </ul>
        <Link
          href="/packs"
          className="inline-block text-[var(--studio-teal)] underline"
        >
          Back to route packs
        </Link>
      </div>
    </StudioShell>
  );
}
