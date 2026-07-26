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
        <li>Soft-simulation only — not live national policy authority.</li>
        <li>Not certified AI audits and not a substitute for legal review.</li>
        <li>Not government command systems or production policy control planes.</li>
        <li>
          Research input:{" "}
          <a href={PAPER_URL} className="underline text-[var(--ri-teal)]" target="_blank" rel="noreferrer">
            arXiv 2607.14782
          </a>
          . Not an authors&apos; product brand; no published authors&apos; code. Not branded as GIRAI.
        </li>
        <li>
          Lock when structured country index beats naive commitment checklist
          with these honesty constraints understood.
        </li>
      </ul>
      <p className="mt-8">
        <Link href="/flows" className="text-[var(--ri-teal)] underline">
          Back to flows
        </Link>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
