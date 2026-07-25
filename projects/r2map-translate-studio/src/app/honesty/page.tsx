import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for R2map Translate Studio."
    >
      <div className="space-y-4 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5 text-sm leading-relaxed">
        <p>
          This product is a <strong>method-lab soft-sim</strong> for comparing
          GAN T1W/T2W→R2map translation against conventional R2 estimation
          baselines.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use.</li>
          <li>Not live PACS write-back.</li>
          <li>Not FDA cleared.</li>
          <li>Not the authors&apos; system or rebrand.</li>
        </ul>
        <p>
          Dual scorers are laboratory evaluators only:{" "}
          <code>gan_r2map_translation</code> (A) vs{" "}
          <code>conventional_r2_baseline</code> (B).
        </p>
        <p>
          Paper:{" "}
          <a className="text-[var(--r2-teal)] underline" href={PAPER_URL}>
            Medical Physics 10.1002/mp.70561
          </a>
          . Authors&apos; code: none published.
        </p>
      </div>
    </StudioShell>
  );
}
