import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Saffron Detect Studio."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          This product is a <strong>method-lab soft-sim</strong> for comparing
          CNN stigma-image adulteration detection against a visual inspection
          baseline. It is inspired by a Research Square comparative CNN study —
          it is <strong>not</strong> the authors&apos; system and does not
          rebrand their work.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not field-validated customs authority</li>
          <li>Not live supply-chain write-back</li>
          <li>Not certified lab accreditation</li>
          <li>Not a replacement for sensory panels or accredited assays</li>
        </ul>
        <p>
          Source:{" "}
          <a className="underline text-[var(--sd-teal)]" href={PAPER_URL}>
            DOI 10.21203/rs.3.rs-10292094/v1
          </a>{" "}
          · authors&apos; code: none published
        </p>
        <p>
          <Link href="/detects" className="text-[var(--sd-teal)] underline">
            Back to detects
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
