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
      <div className="max-w-3xl space-y-6 text-stone-600">
        <p>
          <strong className="text-stone-900">{DISPLAY_NAME}</strong> is a
          method-lab product inspired by agentic meta-analysis research.
          It soft-simulates review pipelines, screen discipline, pooled effects,
          and heterogeneity readiness. It is <em>not</em> a live PubMed client or
          a publication-ready statistics package, and it is not branded as
          AutoSynthesis.
        </p>
        <p>
          <strong className="text-stone-900">Claim:</strong> {CLAIM}
        </p>
        <p>
          Dual score: <strong>A</strong> agentic synthesis plan (search → screen →
          extract → pool + heterogeneity) vs <strong>B</strong> ad-hoc single-pass
          baseline that skips screen discipline and heterogeneity checks.
        </p>
        <div>
          <p className="font-medium text-stone-900">Sources</p>
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
              <Link className="underline" href="/questions">
                open studio
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
