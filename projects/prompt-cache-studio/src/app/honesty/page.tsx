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
          method-lab product inspired by cache-aware prompt compression research.
          It soft-simulates cache hit rates, prefix preservation, and two-tier
          cost savings. It is <em>not</em> a live Anthropic / OpenAI prompt-cache
          control plane, and it is not branded as the paper’s product name.
        </p>
        <p>
          <strong className="text-slate-900">Claim:</strong> {CLAIM}
        </p>
        <p>
          Dual score: <strong>A</strong> cache-aware plan (preserve prefix cache;
          two-tier cost) vs <strong>B</strong> naive query-aware compression that
          busts the cache.
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
              <Link className="underline" href={GUIDE_PATH}>
                {GUIDE_PATH}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
