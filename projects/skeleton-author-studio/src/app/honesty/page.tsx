import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this soft-sim studio is — and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_70%,transparent)]">
        <p>
          Skeleton Author Studio is a <strong>method-lab soft-sim</strong> for
          comparing scaffolded visual authoring of non-visual data experiences
          against naive linear baselines.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Soft-sim only — scores are exploratory, not production QA.</li>
          <li>Not WCAG certified and not a certification authority.</li>
          <li>Not live screen-reader OEM or assistive-technology hardware.</li>
          <li>
            Not the authors&apos; system and not branded as the paper product.
          </li>
        </ul>
        <p>
          Research input:{" "}
          <a className="text-[var(--studio-signal)] underline" href={PAPER_URL}>
            arXiv 2607.14579
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link className="text-[var(--studio-signal)] underline" href="/flows">
            See named user flows
          </Link>{" "}
          or{" "}
          <Link
            className="text-[var(--studio-signal)] underline"
            href="/experiences"
          >
            open experiences
          </Link>
          .
        </p>
      </div>
    </StudioShell>
  );
}
