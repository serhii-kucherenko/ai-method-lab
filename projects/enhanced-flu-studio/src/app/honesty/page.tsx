import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="What this Method Lab product is — and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          Enhanced Flu Studio is a soft-simulation bench for comparing expanded
          enhanced influenza vaccine programs for adults ≥65 against current
          national policy baselines.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not live immunization logistics or appointment booking</li>
          <li>Not clinical prescribing or dose selection for patients</li>
          <li>Not national policy adoption or official recommendation tooling</li>
          <li>Not a rebrand of the authors&apos; Nordic EIV model</li>
        </ul>
        <p>
          Inspired by{" "}
          <a href={PAPER_URL} className="underline text-[var(--ef-teal)]">
            Vaccine 10.1016/j.vaccine.2026.128934
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--ef-teal)]">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
