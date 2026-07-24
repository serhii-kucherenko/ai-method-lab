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
      <div className="max-w-2xl space-y-6 text-stone-600">
        <p>
          <strong className="text-stone-900">{DISPLAY_NAME}</strong> is a Method
          Lab product for planning pocket-conditioned developable molecules.{" "}
          {CLAIM}
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Soft-simulation scores only — not live wet-lab synthesis, docking
            hardware, or clinical developability claims.
          </li>
          <li>
            Inspired by pocket-conditioned developable molecule research; not
            branded as conDitar-dev or any paper system name.
          </li>
          <li>Authors&apos; public code: none linked for this paper.</li>
          <li>
            Distinct from Disease Drug Studio (disease-aware candidates) —
            this product is pocket + developability.
          </li>
        </ul>
        <p>
          Sources:{" "}
          <a
            className="text-[var(--studio-teal)] underline-offset-2 hover:underline"
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
                className="text-[var(--studio-teal)] underline-offset-2 hover:underline"
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
            href="/pockets"
            className="text-[var(--studio-teal)] underline-offset-2 hover:underline"
          >
            Back to pockets
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
