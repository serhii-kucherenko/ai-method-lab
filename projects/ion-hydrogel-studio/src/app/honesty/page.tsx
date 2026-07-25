import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this soft-sim studio is — and what it must never claim."
    >
      <div className="space-y-6 rounded-lg border bg-white p-6">
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Soft-sim only
          </h2>
          <p className="mt-2 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
            Ion Hydrogel Studio scores approximate ion transport under dynamic
            charge regulation vs fixed-charge baselines. It is a method-lab
            analytics bench inspired by ChemRxiv research — not a manufacturing
            or plant control system.
          </p>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Explicit non-claims
          </h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
            <li>Not wet-lab validated membrane manufacturing</li>
            <li>Not live plant ionics or process control</li>
            <li>Not commercial battery cell qualification</li>
            <li>Not the authors&apos; hydrogel system brand or code</li>
          </ul>
        </section>
        <section>
          <h2 className="font-[family-name:var(--font-display)] text-xl">
            Sources
          </h2>
          <p className="mt-2 text-sm">
            Paper:{" "}
            <a className="underline text-[var(--ih-sea)]" href={PAPER_URL}>
              doi.org/10.26434/chemrxiv.15004897/v2
            </a>
            . Authors&apos; code: none published.
          </p>
          <p className="mt-2 text-sm">
            In-repo guide:{" "}
            <Link
              className="underline text-[var(--ih-sea)]"
              href="/docs/guides/132-ion-hydrogel-studio-lessons.md"
            >
              132-ion-hydrogel-studio-lessons
            </Link>
          </p>
        </section>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
