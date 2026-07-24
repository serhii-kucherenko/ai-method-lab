import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  CLAIM,
  DISPLAY_NAME,
  PAPER_ID,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Experiment fence, claim, and research Sources for Graph RAG Studio."
    >
      <div className="max-w-3xl space-y-6 text-slate-700">
        <p>
          <strong className="text-slate-900">{DISPLAY_NAME}</strong> is an AI
          Method Lab product experiment. Soft-simulated GraphRAG construction
          scores are for method learning — not a clinical or production retrieval
          guarantee.
        </p>
        <p>
          <strong className="text-slate-900">Claim:</strong> {CLAIM}
        </p>
        <p>
          Inspired by RAGU (multi-step GraphRAG engine) research. This product is{" "}
          <strong>not</strong> RAGU, <strong>not</strong> Meno-Lite, and does not
          redistribute authors’ weights or brand.
        </p>
        <div>
          <h2 className="font-semibold text-slate-900">Sources</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Paper {PAPER_ID}:{" "}
              <a className="text-teal-800 underline" href={PAPER_URL}>
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors’ code:{" "}
              <a className="text-teal-800 underline" href={AUTHORS_CODE_URL}>
                {AUTHORS_CODE_URL}
              </a>
            </li>
          </ul>
        </div>
        <p>
          <Link href="/" className="text-teal-800 underline">
            Back to landing
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
