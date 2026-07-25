import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this soft-sim is — and what it must never claim."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Surveil Gate Studio is a <strong>method-lab soft-sim</strong> for
          comparing six-pillar trust governance to explainability-only baselines
          on digital public-health surveillance packs.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not a live national surveillance deployment.</li>
          <li>Not a clinical diagnostic product.</li>
          <li>Not regulatory certification or compliance attestation.</li>
          <li>Not the TRUST-GPH brand or authors&apos; official framework.</li>
        </ul>
        <p>
          Inspired by{" "}
          <a className="underline text-[var(--sg-teal)]" href={PAPER_URL}>
            Frontiers DOI 10.3389/fpubh.2026.1901894
          </a>
          . Authors&apos; code: none published.
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
