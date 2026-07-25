import Link from "next/link";
import { DISPLAY_NAME, PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim method-lab product — read before treating scores as vehicle truth."
    >
      <div className="max-w-2xl space-y-4 text-slate-700">
        <p>
          <strong>{DISPLAY_NAME}</strong> is a soft-sim industrial AV simulation /
          world-model eval bench inspired by hierarchical driving world-model
          research. Scores are workflow experiments, not deployment measurements.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not Orbis / Orbis 2 and not an official rebrand of that system.</li>
          <li>Not live vehicle deployment or closed-loop control.</li>
          <li>Not a certification or regulatory approval claim.</li>
          <li>
            Dual score A = hierarchical coarse+detail; B = flat naive rollout —
            for falsification, not road release.
          </li>
        </ul>
        <h2 className="pt-4 font-[family-name:var(--font-display)] text-xl text-slate-900">
          Sources
        </h2>
        <ul className="space-y-1 text-sm">
          <li>
            Paper:{" "}
            <a className="text-[var(--studio-teal)] underline" href={PAPER_URL}>
              {PAPER_URL}
            </a>
          </li>
          <li>Authors&apos; code: none published</li>
        </ul>
        <Link href="/packs" className="inline-block text-[var(--studio-teal)] underline">
          Back to scenario packs
        </Link>
      </div>
    </StudioShell>
  );
}
