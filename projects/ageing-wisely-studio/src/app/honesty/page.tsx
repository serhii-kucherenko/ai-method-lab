import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="What this soft-sim studio is — and what it is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Ageing Wisely Studio is a method-lab soft-simulation bench inspired by
          therapist-supported internet CBT co-design and RCT patterns for older
          adults. It is <strong>not</strong> clinical diagnosis, <strong>not</strong> a
          live therapist replacement, and <strong>not</strong> regulated digital
          therapeutic clearance.
        </p>
        <p>
          Scores are deterministic soft-sim heuristics for comparing
          therapist-supported iCBT designs against waitlist or self-guided
          baselines. They are not patient outcomes, not clinical endpoints, and
          not a rebrand of the authors&apos; Ageing Wisely Online program.
        </p>
        <p>
          Source paper:{" "}
          <a href={PAPER_URL} className="underline text-[var(--aw-sage)]">
            PsyArXiv hukx9
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--aw-sage)]">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
