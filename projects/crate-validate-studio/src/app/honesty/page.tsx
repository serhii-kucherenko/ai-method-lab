import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What Crate Validate Studio is — and is not."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          <strong className="text-[var(--studio-ink)]">Soft-sim only.</strong>{" "}
          Scores are method-lab proxies for ARC RO-Crate structural+semantic
          validation versus metadata-only baselines. They are not institutional
          repository decisions.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not institutional repository write-back.
          </strong>{" "}
          This product does not claim production write-back into institutional
          repositories.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not live ARC farm control.
          </strong>{" "}
          There is no live ARC farm orchestration or production deploy path in
          this soft-sim.
        </p>
        <p>
          <strong className="text-[var(--studio-ink)]">
            Not the authors&apos; system.
          </strong>{" "}
          Inspired by the BioHackrXiv zah28 ARC RO-Crate validation pattern; not
          an official authors&apos; product or rebrand.
        </p>
        <p>
          Source:{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            BioHackrXiv zah28
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link className="underline" href="/flows">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}
