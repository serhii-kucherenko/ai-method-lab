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
      subtitle="Fence, soft-simulation disclaimer, and Sources."
    >
      <div className="space-y-8">
        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-amber)]">
            Fence
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-400">
            <li>
              {DISPLAY_NAME} is a method-lab soft simulation of harnessed vs
              naive deploy plan quality — not a production autoscaler or
              cluster controller.
            </li>
            <li>
              Scores are illustrative plan-quality metrics (TTFO, throughput,
              readiness). They are not measured GPU benchmarks from your
              hardware.
            </li>
            <li>
              Inspired by FlashRT research. We do <strong>not</strong> brand
              this product as FlashRT.
            </li>
            <li>
              Claim: {CLAIM}
            </li>
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-amber)]">
            Sources
          </h2>
          <ul className="mt-3 space-y-2 text-slate-400">
            <li>
              Paper:{" "}
              <a
                className="underline underline-offset-4"
                href={PAPER_URL}
                target="_blank"
                rel="noreferrer"
              >
                {PAPER_URL}
              </a>
            </li>
            {AUTHORS_CODE_URL ? (
              <li>
                Authors’ code:{" "}
                <a
                  className="underline underline-offset-4"
                  href={AUTHORS_CODE_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  {AUTHORS_CODE_URL}
                </a>
              </li>
            ) : (
              <li>Authors’ code: none published with the paper abstract pick</li>
            )}
            <li>
              Guide:{" "}
              <Link href={GUIDE_PATH} className="underline underline-offset-4">
                {GUIDE_PATH}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}
