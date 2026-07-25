import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Enorms Baseline Studio."
    >
      <div className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5 text-sm leading-relaxed">
        <p>
          This product is a <strong>method-lab soft-sim</strong> for comparing
          patient-specific E-norms baselines against population-norm baselines.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use.</li>
          <li>Not live EEG device control.</li>
          <li>Not FDA cleared.</li>
          <li>Not the authors&apos; system or rebrand.</li>
        </ul>
        <p>
          Dual scorers are laboratory evaluators only:{" "}
          <code>patient_specific_enorms</code> (A) vs{" "}
          <code>population_norm_baseline</code> (B).
        </p>
        <p>
          Paper:{" "}
          <a className="text-[var(--eb-teal)] underline" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.13.26357876
          </a>
          . Authors&apos; code: none published.
        </p>
      </div>
    </StudioShell>
  );
}
