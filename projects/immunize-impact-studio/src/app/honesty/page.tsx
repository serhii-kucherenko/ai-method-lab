import Link from "next/link";
import { GUIDE_PATH, PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim only. Method Lab packaging — not live systems or national authority."
    >
      <ul className="list-disc space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <li>Not live immunization logistics or supply-chain control.</li>
        <li>Not clinical prescribing or medical advice.</li>
        <li>Not national policy authority or EPI decision rights.</li>
        <li>Not the authors&apos; ecological study brand or official WHO/Gavi tooling.</li>
        <li>
          Dual scorers are lab soft-sims:{" "}
          <code>immunization_linked_mortality</code> vs{" "}
          <code>coverage_only_dashboard</code>.
        </li>
      </ul>
      <p className="mt-6 text-sm">
        Research input:{" "}
        <a href={PAPER_URL} className="underline text-[var(--ii-teal)]">
          {PAPER_URL}
        </a>
      </p>
      <p className="mt-2 text-sm">
        Lessons guide:{" "}
        <Link href={GUIDE_PATH} className="underline text-[var(--ii-teal)]">
          {GUIDE_PATH}
        </Link>
      </p>
      <p className="mt-6 text-sm">
        <Link href="/packs" className="underline text-[var(--ii-teal)]">
          Back to packs
        </Link>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
