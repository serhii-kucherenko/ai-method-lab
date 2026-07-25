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
          Feature Sufficiency Studio is a <strong>soft-sim</strong> method-lab
          bench. It helps clinical ML ops leads explore when partial observations
          look sufficient versus a full-feature baseline — in simulation only.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical advice and not a diagnostic tool.</li>
          <li>Not FDA-cleared or FDA-regulated medical software.</li>
          <li>
            Not branded as FSA (Feature Sufficiency Analysis) and not the
            authors&apos; system from the paper.
          </li>
          <li>No live EHR integration in this product tree.</li>
        </ul>
        <p>
          Paper source:{" "}
          <a
            className="text-[var(--studio-teal)] underline"
            href={PAPER_URL}
          >
            arXiv 2607.09165
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="text-[var(--studio-teal)] underline">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
