import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim boundaries for Latent Path Studio."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          This product is a <strong>soft-sim</strong> method-lab bench. It does
          not diagnose patients, intervene in crisis, write back to live EHR
          systems, or clear suicide risk.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use</li>
          <li>Not crisis intervention</li>
          <li>Not live EHR write-back</li>
          <li>Not suicide-risk clearance</li>
          <li>Not the authors&apos; study brand</li>
        </ul>
        <p>
          Dual scorers compare{" "}
          <code>multi_domain_latent_trajectory</code> against{" "}
          <code>single_domain_baseline</code> for adolescent MH analytics
          decision support in simulation only.
        </p>
        <p className="text-sm">
          Paper:{" "}
          <a className="underline text-[var(--lp-teal)]" href={PAPER_URL}>
            PsyArXiv ed5nq
          </a>{" "}
          · authors&apos; code: none ·{" "}
          <Link href="/" className="underline text-[var(--lp-teal)]">
            Back home
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
