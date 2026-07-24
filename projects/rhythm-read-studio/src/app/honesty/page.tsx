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
      subtitle="Method-lab fence: soft long-tail ECG train/eval simulation, not a clinical device."
    >
      <div className="space-y-8 text-slate-700">
        <section className="rounded-lg border border-[var(--studio-line)] bg-white p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-coral-ink)]">
            Fence
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              {DISPLAY_NAME} scores angular Gaussian supervised contrastive /
              long-tail profiles versus a flat CE / no-tail baseline.
            </li>
            <li>
              Soft simulation only — scores are method-quality proxies, not
              patient diagnoses or cleared medical device outputs.
            </li>
            <li>
              Not affiliated with or branded as AG-SCL, Open-EXG, or any
              clinical ECG product.
            </li>
            <li>Claim under test: {CLAIM}</li>
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--studio-line)] bg-white p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-coral-ink)]">
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
