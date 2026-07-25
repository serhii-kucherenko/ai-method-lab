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
      subtitle="Soft-simulation only — what this product is and is not."
    >
      <div className="prose prose-stone max-w-3xl space-y-4 text-stone-700">
        <p>
          <strong>{DISPLAY_NAME}</strong> is an AI Method Lab product inspired
          by large-scale terrain modeling for wildfire-prone landscapes. It is{" "}
          <strong>not</strong> the authors&apos; LTM system, not a live
          firefighting dispatch console, and not survey-grade certification.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Dual scores are soft-sim heuristics (physics-aware refresh vs naive
            overlay) for workflow learning — not measured photogrammetry.
          </li>
          <li>
            Terrain packs, aerials, and alignment plans are in-memory demo
            aggregates for this climb.
          </li>
          <li>
            Pricing tiers are hypothetical packaging (seats + refresh compute),
            not a live payment integration.
          </li>
          <li>
            Do not use outputs for evacuation orders, resource allocation, or
            certified mapping deliverables.
          </li>
        </ul>
        <h2 className="font-[family-name:var(--font-display)] text-2xl text-stone-900">
          Sources
        </h2>
        <p>
          Paper:{" "}
          <a href={PAPER_URL} className="underline" target="_blank" rel="noreferrer">
            {PAPER_URL}
          </a>
        </p>
        <p>
          Authors&apos; code:{" "}
          {AUTHORS_CODE_URL ? (
            <a href={AUTHORS_CODE_URL} className="underline">
              {AUTHORS_CODE_URL}
            </a>
          ) : (
            "none published"
          )}
        </p>
        <p>
          <Link href="/packs" className="text-[var(--studio-ember)] underline">
            Back to packs
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
