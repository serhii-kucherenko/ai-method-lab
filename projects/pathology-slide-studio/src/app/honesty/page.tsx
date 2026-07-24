import {
  AUTHORS_CODE_URL,
  CLAIM,
  DISPLAY_NAME,
  GUIDE_PATH,
  PAPER_ID,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Research studio fence, sources, and what this product is not."
    >
      <div className="space-y-8">
        <section className="rounded-lg border border-[var(--studio-line)] bg-white p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Fence
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-700">
            <li>
              {DISPLAY_NAME} is a Method Lab research studio — not a clinical
              diagnostic product, not FDA-cleared software, and not medical
              advice.
            </li>
            <li>
              Scores are transparent dual-impl studio math inspired by
              multi-signal pathology foundation evaluation — not a rebrand of
              any commercial model and not a drop-in of authors&apos; weights.
            </li>
            <li>
              Never claim patient-level diagnosis, treatment, or triage from
              these embeds.
            </li>
            <li>{CLAIM}</li>
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--studio-line)] bg-white p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Sources
          </h2>
          <ul className="mt-3 space-y-2 text-stone-700">
            <li>
              Paper ({PAPER_ID}):{" "}
              <a
                className="underline"
                href={PAPER_URL}
                target="_blank"
                rel="noreferrer"
              >
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors&apos; code:{" "}
              <a
                className="underline"
                href={AUTHORS_CODE_URL}
                target="_blank"
                rel="noreferrer"
              >
                {AUTHORS_CODE_URL}
              </a>
            </li>
            <li>Method Lab guide: {GUIDE_PATH}</li>
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}
