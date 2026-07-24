import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  CLAIM,
  DISPLAY_NAME,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this studio is — and what it is not."
    >
      <div className="max-w-2xl space-y-6 text-slate-600">
        <p>
          <strong className="text-slate-900">{DISPLAY_NAME}</strong> is a
          method-lab soft simulation of formal plan quality for ladder logic
          bomb detection. It does not run a production industrial PLC verifier,
          does not connect to live controllers, and is not a safety-certified
          product.
        </p>
        <p>
          Claim under test: {CLAIM}
        </p>
        <p>
          Dual score: <strong className="text-slate-900">A</strong> = FB-aware
          formal plan quality (keeps function-block bodies; trigger recovery).{" "}
          <strong className="text-slate-900">B</strong> = dropped-FB baseline
          that strips FB bodies and often misses bombs.
        </p>
        <p>
          Branding: never marketed as ESBMC-LLB, ESBMC-PLC+, or any vendor
          verifier. Inspired by the research pattern only.
        </p>
        <div>
          <p className="font-medium text-slate-900">Sources</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Paper:{" "}
              <a className="underline" href={PAPER_URL}>
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors&apos; code:{" "}
              {AUTHORS_CODE_URL ? (
                <a className="underline" href={AUTHORS_CODE_URL}>
                  {AUTHORS_CODE_URL}
                </a>
              ) : (
                "none published with the paper"
              )}
            </li>
          </ul>
        </div>
        <p>
          <Link href="/plants" className="underline">
            Back to plants
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
