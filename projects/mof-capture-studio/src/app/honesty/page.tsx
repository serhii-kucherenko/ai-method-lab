import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Mof Capture Studio — what this product is and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Mof Capture Studio is a method-lab soft-simulation for comparing
          anionic MOF heavy-metal capture against conventional sorbent
          baselines on recorded waters. It helps water-remediation materials
          leads understand deltas before locking a water pack.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not live plant control or process automation.</li>
          <li>Not certified water audits or regulatory lab certification.</li>
          <li>Not municipal procurement authority or bid decisions.</li>
          <li>
            Not a rebrand of SU-102 / ChemRxiv study authors — the paper is
            research input only.
          </li>
        </ul>
        <p>
          Sources:{" "}
          <a
            href={PAPER_URL}
            className="underline text-[var(--mc-teal)]"
            target="_blank"
            rel="noreferrer"
          >
            ChemRxiv 10.26434/chemrxiv.15006194/v1
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Lessons guide:{" "}
          <Link
            href="/docs/guides/148-mof-capture-studio-lessons.md"
            className="underline text-[var(--mc-teal)]"
          >
            148-mof-capture-studio-lessons
          </Link>{" "}
          (repo path).
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
