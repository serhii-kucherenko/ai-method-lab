import { StudioShell } from "@/components/studio-shell";
import { PAPER_URL } from "@/claim";

export function HonestyPage() {
  return (
    <StudioShell title="Honesty fence" subtitle="What this soft-sim is — and is not.">
      <ul className="space-y-3 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <li>Not live social network deployment or production feed ranking.</li>
        <li>Not content moderation authority or enforcement tooling.</li>
        <li>Not attitude-change clearance or certified deliberation outcomes.</li>
        <li>Not the authors&apos; platform brand or a rebrand of their RCT instrument.</li>
        <li>Method-lab soft-sim for comparing productive open-minded designs vs engagement-maximizing baselines.</li>
      </ul>
      <p className="mt-6 text-sm">
        Paper: <a className="underline text-[var(--dd-teal)]" href={PAPER_URL}>SocArXiv dngcj</a> · authors&apos; code: none
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
