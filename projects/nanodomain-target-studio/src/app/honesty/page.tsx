import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this soft-sim studio is — and what it is not."
    >
      <div className="space-y-4 rounded-lg border bg-white p-5 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Nanodomain Target Studio is a method-lab soft-sim bench inspired by
          precision targeting of troponin I phosphorylation via localized
          cAMP/PKA nanodomains. It helps cardio discovery teams compare
          localized targeting to systemic phosphorylation baselines before
          locking a therapy pack narrative.
        </p>
        <p className="font-semibold text-[var(--nt-crimson)]">This is not:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Wet-lab validated IND/NDA evidence</li>
          <li>Live patient dosing or clinical decision support</li>
          <li>Clinical heart-failure diagnosis</li>
          <li>The authors&apos; peptide system or a rebrand of their work</li>
        </ul>
        <p>
          Dual scorers are soft-sim heuristics:{" "}
          <code>localized_nanodomain_target</code> vs{" "}
          <code>systemic_phosphorylation_baseline</code>. Goldens{" "}
          <code>nt-001</code>…<code>nt-030</code> lock dual-impl expectations.
        </p>
        <p>
          Source:{" "}
          <a href={PAPER_URL} className="underline text-[var(--nt-teal)]" target="_blank" rel="noreferrer">
            bioRxiv 10.1101/2025.11.18.689162
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--nt-teal)]">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
