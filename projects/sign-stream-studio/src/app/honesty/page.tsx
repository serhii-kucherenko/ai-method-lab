import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  DISPLAY_NAME,
  PAPER_URL,
  TAGLINE,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim real-time sentence stream for a method-lab product — not live interpreter certification."
    >
      <div className="space-y-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6">
        <p className="text-slate-700">
          <strong>{DISPLAY_NAME}</strong> ({TAGLINE}) is inspired by research
          toward real-time sentence-level sign language translation. This studio
          does <em>not</em> claim to be a live interpreter service, clinical ASL
          adjudication, or the authors’ production stack.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-600">
          <li>Scores are soft-simulation stream / batch quality only.</li>
          <li>
            Dual score A = real-time sentence stream quality; B = offline-batch
            baseline.
          </li>
          <li>Authors published no public code with the digest used here.</li>
        </ul>
        <div className="rounded-md border border-[var(--studio-line)] bg-[var(--studio-bg)] p-4">
          <h2 className="font-[family-name:var(--font-display)] text-lg text-slate-900">
            Keyboard &amp; contrast honesty (a11y category)
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            <li>
              Primary actions use native buttons/links with visible focus rings
              (shadcn focus-visible styles) — soft-sim, not a WCAG audit of a
              production interpreter UI.
            </li>
            <li>
              Ink / aqua / mist palette targets readable body contrast on mist
              panels; hero text on dark wash is for marketing atmosphere only.
            </li>
            <li>
              This fence is category practice documentation — not a claim that
              the studio is certified accessible or replaces live interpreters.
            </li>
          </ul>
        </div>
        <p className="text-sm text-slate-500">
          Sources:{" "}
          <a className="underline" href={PAPER_URL}>
            {PAPER_URL}
          </a>
          {" · "}
          authors&apos; code:{" "}
          {AUTHORS_CODE_URL ? (
            <a className="underline" href={AUTHORS_CODE_URL}>
              {AUTHORS_CODE_URL}
            </a>
          ) : (
            "none published"
          )}
        </p>
        <Link
          href="/streams"
          className="inline-block text-[var(--studio-aqua-deep)] underline-offset-2 hover:underline"
        >
          Back to streams
        </Link>
      </div>
    </StudioShell>
  );
}
