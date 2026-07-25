import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell title="Honesty fence" subtitle="What this soft-sim is — and is not.">
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          Probe Domain Studio is a method-lab soft-sim for comparing cooperative multi-domain
          DNA probe designs against single-domain melting baselines. Scores are deterministic
          fixtures for product evaluation — not wet-lab results.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not wet-lab validated IVD clearance</li>
          <li>Not a whole-blood device or clinical diagnostic deployment</li>
          <li>Not the authors&apos; probe system brand or paper reimplementation claim</li>
          <li>Not a substitute for experimental melt curves or assay validation</li>
        </ul>
        <p>
          Source inspiration:{" "}
          <a className="underline text-[var(--pd-teal)]" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15006161/v2
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/packs" className="underline text-[var(--pd-teal)]">Back to packs</Link>
          {" · "}
          <Link href="/flows" className="underline text-[var(--pd-teal)]">All flows</Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
