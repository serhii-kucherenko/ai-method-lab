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
      subtitle="What this studio is — and is not."
    >
      <div className="max-w-2xl space-y-6 text-slate-600">
        <p>
          <strong className="text-slate-900">{DISPLAY_NAME}</strong> is a
          method-lab experiment. {TAGLINE}
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not a clinical certification or FDA-cleared device.</li>
          <li>Not a live EHR / hospital integration.</li>
          <li>Not branded as OrthoPilot — paper is research input only.</li>
          <li>
            Soft simulation of stream + knowledge grounding for dual-score
            comparison.
          </li>
        </ul>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
            Sources
          </h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
            <li>
              Paper:{" "}
              <a className="underline" href={PAPER_URL}>
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors’ code:{" "}
              {AUTHORS_CODE_URL ? (
                <a className="underline" href={AUTHORS_CODE_URL}>
                  {AUTHORS_CODE_URL}
                </a>
              ) : (
                "none published with the digest"
              )}
            </li>
            <li>
              Product:{" "}
              <code className="text-xs">projects/msk-care-studio/</code>
            </li>
            <li>
              Guide:{" "}
              <Link
                className="underline"
                href="https://github.com/serhii-kucherenko/ai-method-lab/blob/main/docs/guides/52-msk-care-studio-lessons.md"
              >
                docs/guides/52-msk-care-studio-lessons.md
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
