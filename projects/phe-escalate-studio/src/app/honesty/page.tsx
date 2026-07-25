import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Phe Escalate Studio — method-lab only."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          This product is a <strong>soft-sim</strong> bench inspired by
          AI-assisted public-health emergency classification and escalation
          research. It is <strong>not operational MoH authority</strong>,{" "}
          <strong>not live write-back</strong>,{" "}
          <strong>not clinical diagnosis</strong>, and{" "}
          <strong>not the authors&apos; system</strong>.
        </p>
        <p>
          Dual scorers <code>ai_assisted_phe_escalation</code> (A) and{" "}
          <code>manual_triage_baseline</code> (B) are deterministic soft-sim
          functions for pack-lock decisions in the Method Lab — not production
          ministry escalation pipelines.
        </p>
        <p>
          Source paper:{" "}
          <a className="text-[var(--pe-teal)] underline" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.07.26357475
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Continue to{" "}
          <Link href="/flows" className="text-[var(--pe-teal)] underline">
            flows
          </Link>{" "}
          or{" "}
          <Link href="/escalates" className="text-[var(--pe-teal)] underline">
            escalates
          </Link>
          .
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
