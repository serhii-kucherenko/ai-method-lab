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
      subtitle="Soft-sim proof chains for a method-lab product — not EG-VAR, not Lean 4 production."
    >
      <div className="space-y-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
        <p className="text-slate-700">
          <strong>{DISPLAY_NAME}</strong> ({TAGLINE}) is inspired by the EG-VAR
          pattern of evidence-grounded verified agentic reasoning via
          tool-attested kernel proofs. This studio does <em>not</em> ship EG-VAR
          weights, production Lean 4 kernels, or certified theorem-prover
          pipelines.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>Scores are soft-simulation attest / proof quality only.</li>
          <li>
            Dual score A = tool-attested proof quality; B = fluent-only baseline.
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
          href="/claims"
          className="inline-block text-[var(--studio-teal-deep)] underline-offset-2 hover:underline"
        >
          Back to claims
        </Link>
      </div>
    </StudioShell>
  );
}
