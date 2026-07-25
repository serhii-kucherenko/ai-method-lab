import Link from "next/link";
import { PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="Soft-sim packaging boundaries for Persona Triage Studio."
    >
      <ul className="max-w-2xl space-y-4 text-slate-700">
        <li>
          <strong>Soft-sim only.</strong> Scores are method-lab approximations
          for eval packing — not live triage decisions.
        </li>
        <li>
          <strong>Not clinical advice.</strong> Do not use outputs to guide
          patient care.
        </li>
        <li>
          <strong>Not FDA-cleared.</strong> This studio is not a medical device
          and makes no regulatory claims.
        </li>
        <li>
          <strong>Not the authors’ system brand.</strong> Inspired by patterns in{" "}
          <a className="text-[var(--studio-mint)] underline" href={PAPER_URL}>
            arXiv 2607.08625
          </a>
          ; authors published no code. We do not rebrand their chatbot.
        </li>
      </ul>
      <p className="mt-8 text-sm text-slate-500">
        Continue to{" "}
        <Link href="/personae" className="underline">
          personae
        </Link>{" "}
        or{" "}
        <Link href="/flows" className="underline">
          flows
        </Link>
        .
      </p>
    </StudioShell>
  );
}
