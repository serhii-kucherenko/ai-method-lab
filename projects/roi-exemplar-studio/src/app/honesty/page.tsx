import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim only — what this studio is and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          <strong className="text-[var(--studio-ink)]">Soft-sim only.</strong>{" "}
          Scores are method-lab dual-impl simulations of optimized in-context
          exemplars for ROI selection versus naive exemplar baselines.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use</li>
          <li>Not live PACS write-back</li>
          <li>Not a regulatory clearance pathway</li>
          <li>Not the authors&apos; system or paper brand</li>
        </ul>
        <p>
          Source paper:{" "}
          <a className="text-[var(--re-coral)] underline" href={PAPER_URL}>
            iScience 10.1016/j.isci.2026.116518
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Continue to{" "}
          <Link href="/exemplars" className="text-[var(--re-coral)] underline">
            exemplars
          </Link>{" "}
          or{" "}
          <Link href="/flows" className="text-[var(--re-coral)] underline">
            flows
          </Link>
          .
        </p>
      </div>
    </StudioShell>
  );
}
