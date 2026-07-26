import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Split Endo Studio."
    >
      <ul className="list-disc space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <li>Not live OR control or intraoperative guidance.</li>
        <li>Not device clearance, FDA pathway, or implant endorsement.</li>
        <li>Not clinical advice for any patient or surgeon.</li>
        <li>Not the authors&apos; multicenter OSE study brand — research input only.</li>
        <li>Lock means soft-sim readiness, not a surgical decision.</li>
      </ul>
      <p className="mt-6 text-sm">
        Source:{" "}
        <a href={PAPER_URL} className="underline text-[var(--se-teal)]">
          {PAPER_URL}
        </a>
        {" · authors&apos; code: none published"}
      </p>
      <p className="mt-4 text-sm">
        <Link href="/packs" className="underline text-[var(--se-teal)]">
          Back to packs
        </Link>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
