import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Chemgnn Membrane Studio — method-lab only."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          This product is a <strong>soft-sim</strong> bench inspired by ChemGNN
          graph-surrogate CNT membrane design research. It is{" "}
          <strong>not wet-lab validated desalination membranes</strong>,{" "}
          <strong>not live plant write-back</strong>, and{" "}
          <strong>not the authors&apos; system</strong>.
        </p>
        <p>
          Dual scorers <code>chemgnn_surrogate</code> (A) and{" "}
          <code>classical_physics_baseline</code> (B) are deterministic soft-sim
          functions for pack-lock decisions in the Method Lab — not production
          desalination plant pipelines.
        </p>
        <p>
          Source paper:{" "}
          <a className="text-[var(--cm-teal)] underline" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15006282
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Continue to{" "}
          <Link href="/flows" className="text-[var(--cm-teal)] underline">
            flows
          </Link>{" "}
          or{" "}
          <Link href="/membranes" className="text-[var(--cm-teal)] underline">
            membranes
          </Link>
          .
        </p>
      </div>
    </StudioShell>
  );
}
