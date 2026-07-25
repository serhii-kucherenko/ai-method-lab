import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim boundaries for Async Neuro Studio."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          This product is a <strong>soft-sim</strong> method-lab bench. It does
          not diagnose patients, write back to live telehealth systems, or claim
          regulatory clearance.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use</li>
          <li>Not live telehealth write-back</li>
          <li>Not FDA clearance</li>
          <li>Not the authors&apos; VANE brand</li>
        </ul>
        <p>
          Dual scorers compare{" "}
          <code>standardized_async_video_exam</code> against{" "}
          <code>ad_hoc_exam_baseline</code> for study-ops decision support in
          simulation only.
        </p>
        <p className="text-sm">
          Paper:{" "}
          <a className="underline text-[var(--an-teal)]" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.15.26357456
          </a>{" "}
          · authors&apos; code: none ·{" "}
          <Link href="/" className="underline text-[var(--an-teal)]">
            Back home
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
