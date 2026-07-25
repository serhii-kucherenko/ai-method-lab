import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this soft-sim does — and what it must never claim."
    >
      <div className="space-y-6 rounded-lg border bg-white p-6 text-sm leading-relaxed">
        <p>
          Fluoride Label Studio is a <strong>method-lab soft-sim</strong> for
          comparing fast isotopic [18F]fluoride exchange labeling designs against
          multistep prosthetic-group baselines. Scores are deterministic
          analytics aids for PET chemistry leads — not wet-lab measurements.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Not wet-lab validated radiopharmaceutical <strong>GMP batch
            release</strong>.
          </li>
          <li>
            Not <strong>live cyclotron control</strong> or cassette hardware
            orchestration.
          </li>
          <li>
            Not <strong>clinical PET dosing</strong> or patient administration
            guidance.
          </li>
          <li>
            Not a rebrand of the authors&apos; labeling system — inspired by the
            ChemRxiv pattern only.
          </li>
        </ul>
        <p>
          Source:{" "}
          <a className="underline text-[var(--fl-cobalt)]" href={PAPER_URL}>
            ChemRxiv 10.26434/chemrxiv.15005804/v2
          </a>
          . Authors&apos; code: none published.
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
