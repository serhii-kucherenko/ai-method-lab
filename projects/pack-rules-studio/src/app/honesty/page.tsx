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
          method-lab product inspired by constrained personalization for travel
          packing. It soft-simulates traveler profiles, hard rules, soft
          preferences, rule-compliant checklists, and optimize passes. It is{" "}
          <em>not</em> a live airline baggage API, and it does not claim brand
          affiliation with the paper&apos;s product name.
        </p>
        <p>
          <strong className="text-slate-900">Claim:</strong> {CLAIM}
        </p>
        <p>
          Dual score: <strong>A</strong> hard-rules + soft-prefs plan quality
          (symbolic compliant then personalize) vs <strong>B</strong> prefs-only
          baseline that breaks safety / luggage rules.
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
              <Link className="underline" href="/profiles">
                open studio
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
