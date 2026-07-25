import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What Folio Clip Studio is — and is not."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          <strong className="text-[var(--studio-ink)]">Soft-sim only.</strong>{" "}
          Scores are method-lab proxies for multimodal wearable plant-stress
          sensing versus single-sensor baselines. They are not farm decisions.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not field-validated farm deployments.
          </strong>{" "}
          This product does not claim field-validated or production-ready farm
          deployments.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not live greenhouse write-back.
          </strong>{" "}
          There is no live greenhouse control or production crop deploy path in
          this soft-sim.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not the authors&apos; system.
          </strong>{" "}
          Inspired by the ChemRxiv FolioClip paper pattern; not an official
          authors&apos; product or rebrand.
        </p>
        <p>
          Source:{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15005167
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
