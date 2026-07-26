import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim boundaries for Pneumonia Implement Studio."
    >
      <ul className="list-disc space-y-3 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <li>
          This product is a <strong>method-lab soft-sim</strong> for comparing
          CFIR co-design primary-care models to status-quo pathway baselines.
        </li>
        <li>
          It does <strong>not</strong> provide live clinical triage, diagnosis,
          or treatment recommendations.
        </li>
        <li>
          It does <strong>not</strong> write back to hospital EMRs or national
          HMIS systems.
        </li>
        <li>
          It does <strong>not</strong> claim government program authority,
          procurement power, or regulatory approval.
        </li>
        <li>
          The medRxiv paper (
          <a
            href={PAPER_URL}
            className="underline text-[var(--pi-teal)]"
            target="_blank"
            rel="noreferrer"
          >
            10.64898/2026.07.16.26358238
          </a>
          ) is research input only — this studio is not an authors&apos; brand
          or Palwal study rebrand.
        </li>
        <li>
          Lock a pack only when CFIR co-design beats status-quo <em>and</em>{" "}
          overclaim risk stays visible on the scoreboard.
        </li>
      </ul>
    </StudioShell>
  );
}

export default HonestyPage;
