import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Share Colearn Studio."
    >
      <ul className="list-disc space-y-3 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <li>
          Soft-sim only — method-lab packaging for comparing human–AI
          co-learning disease activity labeling against AI-only baselines.
        </li>
        <li>Not clinical diagnostic use and not a care decision tool.</li>
        <li>Not live EHR write-back and not operational chart mutation.</li>
        <li>Not FDA cleared and not a regulated medical device claim.</li>
        <li>
          Not the authors&apos; SHARE system — inspired by the paper pattern,
          not a rebrand.
        </li>
      </ul>
      <p className="mt-8 text-sm">
        Source:{" "}
        <a className="underline text-[var(--sc-teal)]" href={PAPER_URL}>
          medRxiv 10.64898/2026.07.16.26358271
        </a>{" "}
        · authors&apos; code: none published
      </p>
      <p className="mt-4">
        <Link href="/colearns" className="underline text-[var(--sc-teal)]">
          Back to colearns
        </Link>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
