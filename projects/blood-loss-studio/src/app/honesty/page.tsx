import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Blood Loss Studio — what this product is and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Blood Loss Studio is a method-lab soft-simulation for comparing
          weighed-swab measured blood loss against haemoglobin-calculated
          baselines after caesarean birth. It helps obstetric analytics leads
          understand deltas before locking a birth pack.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not live clinical advice or patient care guidance.</li>
          <li>Not EMR write-back or hospital system integration.</li>
          <li>Not medical device clearance or regulatory certification.</li>
          <li>
            Not a rebrand of the medRxiv study authors — the paper is research
            input only.
          </li>
        </ul>
        <p>
          Sources:{" "}
          <a
            href={PAPER_URL}
            className="underline text-[var(--bl-teal)]"
            target="_blank"
            rel="noreferrer"
          >
            medRxiv 10.64898/2026.07.16.26358295
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Lessons guide:{" "}
          <Link
            href="/docs/guides/147-blood-loss-studio-lessons.md"
            className="underline text-[var(--bl-teal)]"
          >
            147-blood-loss-studio-lessons
          </Link>{" "}
          (repo path).
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
