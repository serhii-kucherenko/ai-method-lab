import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence — what this studio is and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Omic Prior Studio is a <strong>soft-sim</strong> bench for comparing
          statistical-priors-informed transformers against a priors-free omics
          baseline.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use</li>
          <li>Not live EHR write-back</li>
          <li>Not FDA cleared</li>
          <li>Not OmicFormer</li>
          <li>Not the authors&apos; system or rebrand</li>
        </ul>
        <p>
          Paper inspiration:{" "}
          <a className="underline text-[var(--op-teal)]" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.06.26357359
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--op-teal)]">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
