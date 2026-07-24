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
      subtitle="Research fence, limits, and Sources for Virulence Predict Studio."
    >
      <div className="space-y-8 text-slate-700">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
            Fence
          </h2>
          <p className="mt-3 max-w-2xl">
            {DISPLAY_NAME} is a research and method-lab product. It is{" "}
            <strong>not</strong> a clinical diagnostic, regulatory submission
            tool, or certified medical device. Scores are dual-implementation
            studio mathematics inspired by published virulence / ARG prediction
            methods — not a drop-in of the authors&apos; trained weights.
          </p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
            Claim
          </h2>
          <p className="mt-3 max-w-2xl">{CLAIM}</p>
        </section>

        <section>
          <h2 className="font-[family-name:var(--font-display)] text-2xl text-slate-900">
            Sources
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Paper DOI / id: {PAPER_ID} —{" "}
              <a className="underline" href={PAPER_URL}>
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors&apos; public code:{" "}
              <a className="underline" href={AUTHORS_CODE_URL}>
                {AUTHORS_CODE_URL}
              </a>
            </li>
            <li>
              Product brand is {DISPLAY_NAME} — not the authors&apos; project
              name.
            </li>
          </ul>
        </section>

        <p>
          <Link href="/" className="underline">
            Back to landing
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
