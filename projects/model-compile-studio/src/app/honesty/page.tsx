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
      subtitle="Method-lab fence: soft compile-plan simulation, not a chip SDK or vendor product."
    >
      <div className="space-y-8 text-slate-700">
        <section className="rounded-lg border border-[var(--studio-line)] bg-white p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-cyan-ink)]">
            Fence
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              {DISPLAY_NAME} scores multi-pass MLIR-style plan quality versus a
              naive single-pass / target-blind baseline.
            </li>
            <li>
              Soft simulation only — scores are plan-quality proxies, not real
              accelerator latency, throughput, or power measurements.
            </li>
            <li>
              Not affiliated with or branded as TPU-MLIR, Sophgo, or any
              hardware vendor SDK.
            </li>
            <li>
              Claim under test: {CLAIM}
            </li>
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--studio-line)] bg-white p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-cyan-ink)]">
            Sources
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Paper:{" "}
              <a className="underline" href={PAPER_URL}>
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors&apos; code:{" "}
              <a className="underline" href={AUTHORS_CODE_URL}>
                {AUTHORS_CODE_URL}
              </a>
            </li>
            <li>
              Lessons guide:{" "}
              <Link className="underline" href={GUIDE_PATH}>
                {GUIDE_PATH}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}
