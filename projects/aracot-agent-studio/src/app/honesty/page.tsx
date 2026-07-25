import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Aracot Agent Studio."
    >
      <div className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5 text-sm leading-relaxed">
        <p>
          This product is a <strong>method-lab soft-sim</strong> for comparing
          Arabic CoT distilled agents against non-distilled multilingual
          baselines.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not production Arabic LLM deployment.</li>
          <li>Not live customer chat write-back.</li>
          <li>Not the authors&apos; system or rebrand.</li>
        </ul>
        <p>
          Dual scorers are laboratory evaluators only:{" "}
          <code>arabic_cot_distilled_agent</code> (A) vs{" "}
          <code>nondistilled_multilingual_baseline</code> (B).
        </p>
        <p>
          Paper:{" "}
          <a className="text-[var(--aa-green)] underline" href={PAPER_URL}>
            Research Square rs-10196257
          </a>
          . Authors&apos; code: none published.
        </p>
      </div>
    </StudioShell>
  );
}
