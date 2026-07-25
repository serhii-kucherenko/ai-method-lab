import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim only — what this studio is and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          <strong className="text-[var(--studio-ink)]">Soft-sim only.</strong>{" "}
          Scores are method-lab dual-impl simulations of sovereign AI
          infrastructure water–energy–emissions accounting versus naive
          cloud-footprint baselines.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not certified carbon audits</li>
          <li>Not live grid metering</li>
          <li>Not national policy authority</li>
          <li>Not the authors&apos; system or paper brand</li>
        </ul>
        <p>
          Source paper:{" "}
          <a className="text-[var(--sc-teal)] underline" href={PAPER_URL}>
            arXiv 2607.13443
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          Continue to{" "}
          <Link href="/costs" className="text-[var(--sc-teal)] underline">
            costs
          </Link>{" "}
          or{" "}
          <Link href="/flows" className="text-[var(--sc-teal)] underline">
            flows
          </Link>
          .
        </p>
      </div>
    </StudioShell>
  );
}
