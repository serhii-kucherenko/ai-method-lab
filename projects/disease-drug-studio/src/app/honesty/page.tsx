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
      subtitle="Method Lab fence — soft scores, research inspiration, no clinical claims."
    >
      <div className="max-w-2xl space-y-6 text-slate-700">
        <p>
          <strong>{DISPLAY_NAME}</strong> is an AI Method Lab product experiment.
          Domain scores are soft-simulated for dual-impl learning. They are not
          docking results, not clinical advice, and not a substitute for wet-lab
          validation.
        </p>
        <p>
          We do <strong>not</strong> brand this product as DrugGen-2 or ship
          authors&apos; model weights. The unique claim we study: {CLAIM}
        </p>
        <div>
          <h2 className="font-medium text-slate-900">Sources</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              Paper:{" "}
              <a
                href={PAPER_URL}
                className="underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors&apos; code:{" "}
              <a
                href={AUTHORS_CODE_URL}
                className="underline underline-offset-4"
                target="_blank"
                rel="noreferrer"
              >
                {AUTHORS_CODE_URL}
              </a>
            </li>
            <li>
              Lessons guide:{" "}
              <code className="rounded bg-slate-100 px-1">{GUIDE_PATH}</code>
            </li>
          </ul>
        </div>
        <p>
          <Link href="/" className="underline underline-offset-4">
            Back to landing
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
