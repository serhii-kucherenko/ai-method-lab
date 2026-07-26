import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim only. This product never claims live clinical prescribing, diagnostic clearance, or national treatment guideline authority."
    >
      <ul className="space-y-3 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <li>Not live clinical prescribing or treatment decisions.</li>
        <li>Not diagnostic clearance or laboratory confirmation authority.</li>
        <li>Not national treatment guideline authority.</li>
        <li>Not the authors&apos; IPD meta-analysis product brand.</li>
        <li>
          Research input only:{" "}
          <a href={PAPER_URL} className="underline text-[var(--sg-teal)]" target="_blank" rel="noreferrer">
            medRxiv 10.64898/2026.07.10.26357688
          </a>
          .
        </li>
      </ul>
      <p className="mt-8">
        <Link href="/packs" className="text-[var(--sg-teal)] underline">
          Back to packs
        </Link>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
