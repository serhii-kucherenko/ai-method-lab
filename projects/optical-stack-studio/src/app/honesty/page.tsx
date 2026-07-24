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
          Lab product for open-vocabulary multilayer coating inverse design.{" "}
          {CLAIM}
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Soft-simulation scores only — not live fab deposition, spectrometer
            hardware, or production coating certification.
          </li>
          <li>
            Inspired by open-vocabulary discrete+continuous flow-matching
            research patterns; not branded as IrisFlow or any paper system name.
          </li>
          <li>Authors&apos; public code: none linked for this paper.</li>
          <li>
            Distinct IA: briefs, materials, thicknesses, stacks, spectra,
            compare — not a desk shell or medical localize clone.
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
            href="/briefs"
            className="text-[var(--studio-cyan)] underline-offset-2 hover:underline"
          >
            Back to briefs
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
