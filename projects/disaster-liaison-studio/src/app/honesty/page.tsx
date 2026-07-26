import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Disaster Liaison Studio."
    >
      <ul className="list-disc space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <li>Not live emergency dispatch or radio/CAD integration.</li>
        <li>Not clinical triage authority or medical advice.</li>
        <li>Not a government command-and-control system.</li>
        <li>
          Inspired by public research on pediatric-perinatal disaster liaison
          operations — not an authors’ DLPPM product brand.
        </li>
        <li>
          Dual scorers are method-lab soft-sims:{" "}
          <code>pediatric_perinatal_liaison</code> vs{" "}
          <code>generic_disaster_hq</code>.
        </li>
        <li>Lock packs only when deltas and this fence are understood.</li>
      </ul>
      <p className="mt-6 text-sm">
        Source:{" "}
        <a href={PAPER_URL} className="underline text-[var(--dl-teal)]" target="_blank" rel="noreferrer">
          Pediatrics International 10.1111/ped.70488
        </a>
        {" · "}
        <Link href="/" className="underline text-[var(--dl-teal)]">
          Landing
        </Link>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
