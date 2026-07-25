import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export function HonestyPage() {
  return (
    <StudioShell title="Honesty fence" subtitle="What this soft-sim is — and is not.">
      <ul className="space-y-3 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <li>Not live regulatory authority or binding policy decisions.</li>
        <li>Not government deployment or production governance systems.</li>
        <li>Not certified public-opinion polling or survey fieldwork.</li>
        <li>Not the authors&apos; survey brand or a rebrand of their instrument.</li>
        <li>Method-lab soft-sim for comparing safety-first public-oversight packs vs innovation-first self-regulation baselines.</li>
      </ul>
      <p className="mt-6 text-sm">
        Paper: <a className="underline text-[var(--cp-teal)]" href={PAPER_URL}>arXiv 2607.14585</a> · authors&apos; code: none
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
