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
      subtitle="What this studio is — and is not."
    >
      <div className="max-w-2xl space-y-6 text-slate-600">
        <p>
          <strong className="text-slate-900">{DISPLAY_NAME}</strong> is a Method
          Lab product for CXR disease classification with lesion localization.{" "}
          {CLAIM}
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Soft-simulation scores only — not clinical certification, live PACS
            integration, or regulatory clearance.
          </li>
          <li>
            Inspired by CXR classify + localize research patterns; not branded
            as Inspectra or any paper system name.
          </li>
          <li>Authors&apos; public code: none linked for this paper.</li>
          <li>
            Distinct from Cardiac CT Studio (HITL segment + phenotype) — this
            product is chest radiograph classify + lesion localize.
          </li>
        </ul>
        <p>
          Sources:{" "}
          <a
            className="text-[var(--studio-cyan)] underline-offset-2 hover:underline"
            href={PAPER_URL}
            target="_blank"
            rel="noreferrer"
          >
            {PAPER_URL}
          </a>
          {AUTHORS_CODE_URL ? (
            <>
              {" "}
              · code{" "}
              <a
                className="text-[var(--studio-cyan)] underline-offset-2 hover:underline"
                href={AUTHORS_CODE_URL}
                target="_blank"
                rel="noreferrer"
              >
                {AUTHORS_CODE_URL}
              </a>
            </>
          ) : null}
        </p>
        <p>
          <Link
            href="/exams"
            className="text-[var(--studio-cyan)] underline-offset-2 hover:underline"
          >
            Back to exams
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
