import Link from "next/link";
import {
  AUTHORS_CODE_URL,
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
      <div className="space-y-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6 text-slate-700">
        <p>
          <strong>{DISPLAY_NAME}</strong> is a Method Lab experiment for scoring
          multimodal (text+image) medical consult next-responses. It is inspired
          by research on real-world multimodal consult evaluation. It is{" "}
          <strong>not</strong> clinical certification, FDA clearance, or a live
          hospital chat system.
        </p>
        <p>
          Do <strong>not</strong> brand this product as MedRealMM. Scores are a
          soft simulation for method-lab comparison of multimodal-aware vs
          text-only baselines.
        </p>
        <p>
          Authors&apos; public code for the source paper:{" "}
          {AUTHORS_CODE_URL ? (
            <a href={AUTHORS_CODE_URL} className="underline-offset-2 hover:underline">
              {AUTHORS_CODE_URL}
            </a>
          ) : (
            <em>none published</em>
          )}
          .
        </p>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
            Sources
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Paper:{" "}
              <a
                href={PAPER_URL}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {PAPER_URL}
              </a>
            </li>
            <li>
              Guide:{" "}
              <Link
                href="/docs/guides/61-consult-bench-studio-lessons.md"
                className="underline-offset-2 hover:underline"
              >
                docs/guides/61-consult-bench-studio-lessons.md
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
