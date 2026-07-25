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
      subtitle="Soft-sim experience-aware hold for a method-lab product — not live marketplace control."
    >
      <div className="space-y-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
        <p className="text-slate-700">
          <strong>{DISPLAY_NAME}</strong> ({TAGLINE}) is inspired by
          experience-aware hold control for ride-hailing matching. This studio
          does <em>not</em> claim to be EXHOLD, DiDi production dispatch, or a
          live marketplace controller.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>Scores are soft-simulation hold / first-feasible quality only.</li>
          <li>
            Dual score A = experience-aware hold quality; B = first-feasible
            baseline.
          </li>
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
          href="/holds"
          className="inline-block text-[var(--studio-amber-deep)] underline-offset-2 hover:underline"
        >
          Back to holds
        </Link>
      </div>
    </StudioShell>
  );
}
