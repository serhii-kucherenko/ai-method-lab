import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Abe Precision Studio — what this product is and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Abe Precision Studio is a method-lab soft-simulation for comparing
          domain-insertion adenine base editor precision against baseline ABE
          windows on recorded editor packs. It helps gene-editing analytics
          leads understand deltas before locking an editor pack.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not wet-lab validation or experimental confirmation.</li>
          <li>Not IND/NDA readiness or regulatory filing support.</li>
          <li>Not patient dosing or clinical gene-therapy advice.</li>
          <li>
            Not a rebrand of the bioRxiv study authors — the paper is research
            input only.
          </li>
        </ul>
        <p>
          Sources:{" "}
          <a
            href={PAPER_URL}
            className="underline text-[var(--ap-teal)]"
            target="_blank"
            rel="noreferrer"
          >
            bioRxiv 10.64898/2026.07.03.736350
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Lessons guide:{" "}
          <Link
            href="/docs/guides/149-abe-precision-studio-lessons.md"
            className="underline text-[var(--ap-teal)]"
          >
            149-abe-precision-studio-lessons
          </Link>{" "}
          (repo path).
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
