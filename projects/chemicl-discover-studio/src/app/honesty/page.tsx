import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Chemicl Discover Studio — method-lab only."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          This product is a <strong>soft-sim</strong> bench inspired by
          multimodal ChemICL chemistry discovery research. It is{" "}
          <strong>not wet-lab validated discovery</strong>,{" "}
          <strong>not live ELN write-back</strong>, and{" "}
          <strong>not the authors&apos; system</strong>.
        </p>
        <p>
          Dual scorers <code>multimodal_chemicl</code> (A) and{" "}
          <code>text_only_icl_baseline</code> (B) are deterministic soft-sim
          functions for pack-lock decisions in the Method Lab — not production
          chemistry discovery pipelines.
        </p>
        <p>
          Source paper:{" "}
          <a className="text-[var(--cd-teal)] underline" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15006280
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Continue to{" "}
          <Link href="/flows" className="text-[var(--cd-teal)] underline">
            flows
          </Link>{" "}
          or{" "}
          <Link href="/discovers" className="text-[var(--cd-teal)] underline">
            discovers
          </Link>
          .
        </p>
      </div>
    </StudioShell>
  );
}
