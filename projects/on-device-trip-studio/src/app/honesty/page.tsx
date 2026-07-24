import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  CLAIM,
  DISPLAY_NAME,
  GUIDE_PATH,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="What this Method Lab studio is — and is not."
    >
      <div className="max-w-3xl space-y-6 text-slate-600">
        <p>
          <strong className="text-slate-900">{DISPLAY_NAME}</strong> is a
          method-lab product inspired by on-device constrained itinerary
          planning (Plan→Learn→Adapt). It soft-simulates trip briefs, hard
          constraints, desire signals, feasibility-first plans, and adapt
          passes. It is <em>not</em> a live maps or booking API, does not ship a
          mobile binary, and is not branded as PLA.
        </p>
        <p>
          <strong className="text-slate-900">Claim:</strong> {CLAIM}
        </p>
        <p>
          Dual score: <strong>A</strong> feasibility-first Plan→Learn→Adapt plan
          quality vs <strong>B</strong> desire-first baseline that skips hard
          constraints (cloud-LLM style).
        </p>
        <div>
          <p className="font-medium text-slate-900">Sources</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
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
                "none published with the digest"
              )}
            </li>
            <li>
              Tutor guide:{" "}
              <span className="font-mono text-xs">{GUIDE_PATH}</span>
              {" · "}
              <Link className="underline" href="/trips">
                open studio
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
