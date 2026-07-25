import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim method-lab product — read before treating scores as clinical truth."
    >
      <div className="max-w-2xl space-y-4 text-slate-700">
        <p>
          <strong>{DISPLAY_NAME}</strong> is a soft-sim eval / safety release-gate
          bench inspired by medical AI safety-boundary research. Scores are
          workflow experiments, not clinical measurements.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not MedFailBench and not an official rebrand of that benchmark.</li>
          <li>Not clinical decision support or a carepath product.</li>
          <li>Not a live hospital deployment or certification claim.</li>
          <li>
            Dual score A = fail-gate taxonomy diagnosis; B = correctness-only
            baseline — for falsification, not treatment.
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
        <Link href="/cases" className="inline-block text-[var(--studio-teal)] underline">
          Back to fail cases
        </Link>
      </div>
    </StudioShell>
  );
}
