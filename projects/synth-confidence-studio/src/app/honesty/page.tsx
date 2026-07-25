import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What Synth Confidence Studio is — and is not."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          <strong className="text-[var(--studio-ink)]">Soft-sim only.</strong>{" "}
          Scores are method-lab proxies for confidence-gated AI retrosynthesis
          versus naive AI route baselines. They are not manufacturing decisions.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not wet-lab validated manufacturing routes.
          </strong>{" "}
          This product does not claim wet-lab validated or production-ready
          manufacturing routes.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">Not live ELN.</strong>{" "}
          There is no live electronic lab notebook write-back or production
          chemistry deploy path in this soft-sim.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not the authors&apos; system.
          </strong>{" "}
          Inspired by the ChemRxiv paper pattern; not an official authors&apos;
          product or rebrand.
        </p>
        <p>
          Source:{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15006146
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
