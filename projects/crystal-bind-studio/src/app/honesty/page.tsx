import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  DISPLAY_NAME,
  PAPER_URL,
  TAGLINE,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim embeddings for a method-lab product — not MatBind, not wet-lab spectra."
    >
      <div className="space-y-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
        <p className="text-slate-700">
          <strong>{DISPLAY_NAME}</strong> ({TAGLINE}) is inspired by the MatBind
          pattern of a shared embedding space across structure, diffraction-like
          patterns, density of states, and language. This studio does{" "}
          <em>not</em> ship MatBind weights, measured XRD/DOS instruments, or
          production materials databases.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>Scores are soft-simulation plan / retrieve quality only.</li>
          <li>Dual score A = multimodal bind; B = single-modality baseline.</li>
          <li>Authors published no public code with the digest used here.</li>
        </ul>
        <p className="text-sm text-slate-500">
          Sources:{" "}
          <a className="underline" href={PAPER_URL}>
            {PAPER_URL}
          </a>
          {" · "}
          authors&apos; code:{" "}
          {AUTHORS_CODE_URL ? (
            <a className="underline" href={AUTHORS_CODE_URL}>
              {AUTHORS_CODE_URL}
            </a>
          ) : (
            "none published"
          )}
        </p>
        <Link
          href="/packs"
          className="inline-block text-[var(--studio-teal-deep)] underline-offset-2 hover:underline"
        >
          Back to crystal packs
        </Link>
      </div>
    </StudioShell>
  );
}
