import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Pestwin Control Studio — method-lab only."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          This product is a <strong>soft-sim</strong> bench inspired by PesTwin
          modular multi-agent pest/vector control research. It is{" "}
          <strong>not field-validated pest eradication</strong>,{" "}
          <strong>not live spray-fleet write-back</strong>, and{" "}
          <strong>not the authors&apos; system</strong>.
        </p>
        <p>
          Dual scorers <code>modular_multiagent_pest_control</code> (A) and{" "}
          <code>single_species_baseline</code> (B) are deterministic soft-sim
          functions for pack-lock decisions in the Method Lab — not production
          vector-control spray pipelines.
        </p>
        <p>
          Source paper:{" "}
          <a className="text-[var(--pc-green)] underline" href={PAPER_URL}>
            arXiv 2607.09420
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Continue to{" "}
          <Link href="/flows" className="text-[var(--pc-green)] underline">
            flows
          </Link>{" "}
          or{" "}
          <Link href="/controls" className="text-[var(--pc-green)] underline">
            controls
          </Link>
          .
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
