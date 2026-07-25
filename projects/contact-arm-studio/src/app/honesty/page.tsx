import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this soft-sim is — and what it must never claim."
    >
      <div className="max-w-2xl space-y-4 text-slate-700">
        <p>
          Contact Arm Studio is a <strong>soft-sim</strong> method-lab bench. It
          helps robotics teams reason about planned contact and sensing evidence
          in simulation only.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not a live robot controller or a deployment runtime.</li>
          <li>Not a safety certification, safety case, or safety guarantee.</li>
          <li>Not branded as TACTIC and not the authors&apos; system from the paper.</li>
          <li>No physical robot, actuator, or sensor integration is implied.</li>
        </ul>
        <p>
          Paper source:{" "}
          <a
            className="text-[var(--studio-orange)] underline"
            href={PAPER_URL}
          >
            arXiv 2607.09218
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="text-[var(--studio-orange)] underline">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
