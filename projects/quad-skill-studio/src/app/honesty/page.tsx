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
          Lab product for planning multi-skill quadruped locomotion on wild
          terrain. {CLAIM}
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Soft-simulation scores only — not live robot control or field
            deployment.
          </li>
          <li>
            Inspired by multi-skill perceptive locomotion research; not branded
            as APT-RL or any paper system name.
          </li>
          <li>Authors&apos; public code: none linked for this paper.</li>
        </ul>
        <p>
          Sources:{" "}
          <a
            className="text-[var(--studio-earth)] underline-offset-2 hover:underline"
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
                className="text-[var(--studio-earth)] underline-offset-2 hover:underline"
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
            href="/robots"
            className="text-[var(--studio-earth)] underline-offset-2 hover:underline"
          >
            Back to robots
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
