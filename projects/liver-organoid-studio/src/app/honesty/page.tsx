import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this studio is — and what it must never claim."
    >
      <div className="space-y-4 rounded-lg border bg-white p-5 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          Liver Organoid Studio is a <strong>method-lab soft-sim</strong> for
          comparing multicellular liver organoid (HLO) models to single-lineage
          hepatocyte-like cell (HLC) baselines for MASLD screening analytics.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Not wet-lab validated organoid GMP manufacture.
          </li>
          <li>Not live patient transplant or clinical deployment.</li>
          <li>Not clinical MASLD diagnosis or treatment advice.</li>
          <li>Not a rebrand of the authors&apos; organoid system.</li>
        </ul>
        <p>
          Research input:{" "}
          <a className="underline text-[var(--lo-teal)]" href={PAPER_URL}>
            bioRxiv 10.64898/2026.06.02.729501
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Guide:{" "}
          <Link
            href="/docs/guides/133-liver-organoid-studio-lessons.md"
            className="underline text-[var(--lo-teal)]"
          >
            lessons for this product
          </Link>{" "}
          (repo path).
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
