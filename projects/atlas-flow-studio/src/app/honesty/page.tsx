import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Atlas Flow Studio."
    >
      <ul className="list-disc space-y-3 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <li>
          Soft-sim only — method-lab packaging for comparing an integrated atlas
          registration + quantification workflow against fragmented multi-tool
          baselines.
        </li>
        <li>Not live microscope control and not instrument orchestration.</li>
        <li>Not clinical diagnostic use and not a care decision tool.</li>
        <li>Not FDA cleared and not a regulated medical device claim.</li>
        <li>
          Not NeuroFlow and not the authors&apos; system — inspired by the paper
          pattern, not a rebrand.
        </li>
      </ul>
      <p className="mt-8 text-sm">
        Source:{" "}
        <a className="underline text-[var(--af-teal)]" href={PAPER_URL}>
          bioRxiv 10.64898/2026.07.15.737186
        </a>{" "}
        · authors&apos; code: none published
      </p>
      <p className="mt-4">
        <Link href="/atlases" className="underline text-[var(--af-teal)]">
          Back to atlases
        </Link>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
