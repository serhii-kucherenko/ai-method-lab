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
          Cache Hit Studio is a <strong>soft-sim</strong> bench for comparing
          structured computational hit-finding against a naive docking baseline.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not wet-lab validated hits</li>
          <li>Not live ELN write-back</li>
          <li>Not FDA cleared</li>
          <li>Not CACHE (the challenge brand)</li>
          <li>Not the authors&apos; system or rebrand</li>
        </ul>
        <p>
          Paper inspiration:{" "}
          <a className="underline text-[var(--ch-teal)]" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15005792/v2
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--ch-teal)]">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
