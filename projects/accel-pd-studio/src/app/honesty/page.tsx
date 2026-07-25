import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fences for Accel PD Studio — read before locking a pack."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          This product is a <strong>method-lab soft-sim</strong> for comparing
          multi-channel transformer physical-activity representations against a
          handcrafted PA-feature baseline. It is not a clinical tool.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical diagnostic use</li>
          <li>Not live device write-back</li>
          <li>Not FDA cleared</li>
          <li>Not PABformer</li>
          <li>Not the authors&apos; system</li>
        </ul>
        <p>
          Dual scorers{" "}
          <code>multichannel_pa_transformer</code> and{" "}
          <code>handcrafted_pa_baseline</code> are soft-sim oracles for pack
          decisions — they do not diagnose Parkinson disease or any other
          condition.
        </p>
        <p>
          Source paper:{" "}
          <a className="underline text-[var(--ap-teal)]" href={PAPER_URL}>
            medRxiv 10.1101/2025.08.12.25333460
          </a>
          . Authors&apos; code: none published.
        </p>
        <p>
          <Link href="/accels" className="underline text-[var(--ap-teal)]">
            Back to accels
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
