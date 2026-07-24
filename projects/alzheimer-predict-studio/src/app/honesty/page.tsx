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
          Lab product for planning imputation-free Alzheimer’s risk with
          calibrated uncertainty. {CLAIM}
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Soft-simulation scores only — not clinical certification, live EHR
            diagnosis, or regulatory clearance.
          </li>
          <li>
            Inspired by imputation-free Alzheimer’s risk research; not branded
            as NITROGEN or any paper system name.
          </li>
          <li>Authors&apos; public code: none linked for this paper.</li>
          <li>
            Distinct from MSK Care Studio (MSK pathways) — this product is
            Alzheimer risk + missingness honesty.
          </li>
        </ul>
        <p>
          Sources:{" "}
          <a
            className="text-[var(--studio-blue)] underline-offset-2 hover:underline"
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
                className="text-[var(--studio-blue)] underline-offset-2 hover:underline"
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
            href="/cohorts"
            className="text-[var(--studio-blue)] underline-offset-2 hover:underline"
          >
            Back to cohorts
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
