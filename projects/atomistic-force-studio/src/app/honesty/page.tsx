import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What Atomistic Force Studio is — and is not."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          <strong className="text-[var(--studio-ink)]">Soft-sim only.</strong>{" "}
          Scores are method-lab proxies for foundation-model atomistics versus
          classical force-field baselines. They are not manufacturing decisions.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not DFT-validated manufacturing sims.
          </strong>{" "}
          This product does not claim DFT-validated or production manufacturing
          simulations.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not live HPC write-back.
          </strong>{" "}
          There is no live HPC cluster control or production deploy path in
          this soft-sim.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not the authors&apos; system.
          </strong>{" "}
          Inspired by the ChemRxiv FeNNix-Bio1 paper pattern; not an official
          authors&apos; product or rebrand.
        </p>
        <p>
          Source:{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv-2025-f1hgn
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
