import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What Transducin Measure Studio is — and is not."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          <strong className="text-[var(--studio-ink)]">Soft-sim only.</strong>{" "}
          Scores are method-lab proxies for SNOMED-CT coded OCT measurement
          recovery versus raw proprietary private-tag dumps. They are not
          clinical decisions.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not clinical deployment.
          </strong>{" "}
          This product does not claim production clinical use or care pathways.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not live PACS write-back.
          </strong>{" "}
          There is no live PACS write-back or production imaging archive path in
          this soft-sim.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not diagnostic use.
          </strong>{" "}
          Scores are not diagnoses and must not be used to guide patient care.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not the authors&apos; system.
          </strong>{" "}
          Inspired by the medRxiv Transducin Optopol/Zeiss → DICOM SR pattern;
          not an official authors&apos; product or rebrand.
        </p>
        <p>
          Source:{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.14.26357256
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link className="underline" href="/flows">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
