import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Care Query Studio — what this product is and is not."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          Care Query Studio is a <strong>method-lab soft-sim</strong> for comparing
          multilingual point-of-care medical query LLM answers against a local
          clinician baseline before locking a query pack.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use</li>
          <li>Not live EHR write-back</li>
          <li>Not FDA cleared</li>
          <li>Not NigBench and not an authors&apos; rebrand</li>
          <li>Not a substitute for licensed clinical judgment</li>
        </ul>
        <p>
          Dual scorers are labeled explicitly:{" "}
          <code>multilingual_poc_llm_answers</code> (A) and{" "}
          <code>local_clinician_baseline</code> (B). Scores are soft-sim proxies
          only.
        </p>
        <p>
          Source paper:{" "}
          <a className="underline text-[var(--cq-teal)]" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.05.26356776
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/queries" className="underline text-[var(--cq-teal)]">
            Back to queries
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
