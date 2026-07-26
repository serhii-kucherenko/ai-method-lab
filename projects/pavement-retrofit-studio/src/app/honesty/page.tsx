import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Pavement Retrofit Studio."
    >
      <ul className="list-disc space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <li>Not live road construction control or field crew dispatch.</li>
        <li>Not certified emissions audits or regulatory air-quality filings.</li>
        <li>Not municipal procurement authority or bid award systems.</li>
        <li>
          Inspired by public research on photocatalytic pavement as ecosystem
          technology — not an authors&apos; PlusTi product brand.
        </li>
        <li>
          Dual scorers are method-lab soft-sims:{" "}
          <code>photocatalytic_pavement_retrofit</code> vs{" "}
          <code>conventional_preservation</code>.
        </li>
        <li>Lock packs only when deltas and this fence are understood.</li>
      </ul>
      <p className="mt-6 text-sm">
        Source:{" "}
        <a href={PAPER_URL} className="underline text-[var(--pr-teal)]" target="_blank" rel="noreferrer">
          ChemRxiv 10.26434/chemrxiv.15006236/v1
        </a>
        {" · "}
        <Link href="/" className="underline text-[var(--pr-teal)]">
          Landing
        </Link>
      </p>
    </StudioShell>
  );
}

export default HonestyPage;
