import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this product is — and is not."
    >
      <div className="max-w-2xl space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          Coload Order Studio is a <strong>method-lab soft-sim</strong> for
          comparing ordered chemo-photothermal co-load sequences against
          simultaneous-load baselines on hollow mesoporous carriers.
        </p>
        <p>It does <strong>not</strong> claim:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Wet-lab validated GMP nanomedicine manufacture</li>
          <li>Live patient dosing</li>
          <li>Clinical oncology clearance</li>
          <li>Branding as the authors&apos; HSN system</li>
        </ul>
        <p>
          Inspired by{" "}
          <a href={PAPER_URL} className="underline text-[var(--co-slate)]">
            Nanomaterials 10.3390/nano16130805
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/flows" className="underline text-[var(--co-slate)]">
            Back to flows
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
