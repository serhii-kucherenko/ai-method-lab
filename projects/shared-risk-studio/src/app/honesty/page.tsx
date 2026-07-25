import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What Shared Risk Studio is — and is not."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          <strong className="text-[var(--studio-ink)]">Soft-sim only.</strong>{" "}
          Scores are method-lab proxies for shared multi-disease representations
          versus disease-specific baselines. They are not clinical decisions.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">Not CDS cleared.</strong>{" "}
          This product is not cleared as clinical decision support and must not
          be used to guide individual patient care.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">Not live EHR.</strong>{" "}
          There is no live electronic health record write-back or production
          biobank deploy path in this soft-sim.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not the authors&apos; system / not RisQ brand.
          </strong>{" "}
          Inspired by the medRxiv paper pattern; not an official authors&apos;
          product and not branded RisQ.
        </p>
        <p>
          Source:{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.07.26357373
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
