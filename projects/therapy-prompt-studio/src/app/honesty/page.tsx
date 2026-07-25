import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export function HonestyPage() {
  return (
    <StudioShell
      title="Honesty"
      subtitle="Soft-sim fence for Therapy Prompt Studio."
    >
      <div className="space-y-4 text-[color-mix(in_srgb,var(--studio-ink)_75%,transparent)]">
        <p>
          This product is a <strong>method-lab soft-sim</strong> for comparing
          structured therapy-safety gates against a prompt-only safety baseline
          on high-risk psychiatric scenarios. It is inspired by a medRxiv
          prompt-engineering safety study — it is <strong>not</strong> the
          authors&apos; system and does not rebrand their work.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Not clinical therapy</li>
          <li>Not a crisis hotline replacement</li>
          <li>Not live patient chat write-back</li>
          <li>Not FDA cleared</li>
        </ul>
        <p>
          Source:{" "}
          <a className="underline text-[var(--tp-teal)]" href={PAPER_URL}>
            medRxiv 10.64898/2026.07.16.26358261
          </a>{" "}
          · authors&apos; code: none published
        </p>
        <p>
          <Link href="/prompts" className="text-[var(--tp-teal)] underline">
            Back to prompts
          </Link>
        </p>
      </div>
    </StudioShell>
  );
}

export default HonestyPage;
