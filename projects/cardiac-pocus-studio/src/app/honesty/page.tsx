import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fences — what this product is and is not."
    >
      <ul className="space-y-3 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <li>Soft-simulation only — not live diagnostic clearance.</li>
        <li>Not clinical advice and not a substitute for clinical judgment.</li>
        <li>Not PACS write-back or production imaging workflow integration.</li>
        <li>
          Research input:{" "}
          <a href={PAPER_URL} className="underline text-[var(--cp-teal)]" target="_blank" rel="noreferrer">
            Research Square 10.21203/rs.3.rs-9994279/v1
          </a>
          . Not an authors&apos; product brand; no published authors&apos; code.
        </li>
        <li>
          Lock when cardiac POCUS COPD patterns beat lung-ultrasound baseline
          with these honesty constraints understood.
        </li>
      </ul>
      <p className="mt-8">
        <Link href="/flows" className="text-[var(--cp-teal)] underline">
          Back to flows
        </Link>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
