import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What Variant Probe Studio is — and is not."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          <strong className="text-[var(--studio-ink)]">Soft-sim only.</strong>{" "}
          Scores are method-lab proxies for interpretable genomic FM probes
          versus opaque pathogenicity baselines. They are not clinical
          decisions.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not diagnostic cleared.
          </strong>{" "}
          This product is not cleared as a diagnostic device and must not be
          used to guide individual patient care.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">Not live LIMS.</strong>{" "}
          There is no live laboratory information system write-back or
          production clinical deploy path in this soft-sim.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not the authors&apos; system.
          </strong>{" "}
          Inspired by the bioRxiv paper pattern; not an official authors&apos;
          product.
        </p>
        <p>
          Source:{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            bioRxiv 10.64898/2026.04.10.717844
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
