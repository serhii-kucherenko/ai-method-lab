import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  CLAIM,
  DISPLAY_NAME,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this method-lab studio is — and is not."
    >
      <div className="space-y-6 text-stone-700">
        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Claim
          </h2>
          <p className="mt-2 leading-relaxed">{CLAIM}</p>
        </section>
        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Limits
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Soft simulation of multi-agent game checks — not a production LLM
              gateway.
            </li>
            <li>
              Inspired by the paper pattern; not branded as G-Frame and not a
              reimplementation of authors’ code (none published).
            </li>
            <li>
              Dual scores compare multi-agent game quality vs single-agent
              fluency inside this studio only.
            </li>
          </ul>
        </section>
        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Sources
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              Paper:{" "}
              <a
                className="text-[var(--studio-amber)] underline-offset-2 hover:underline"
                href={PAPER_URL}
              >
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors’ code:{" "}
              {AUTHORS_CODE_URL ? (
                <a href={AUTHORS_CODE_URL}>{AUTHORS_CODE_URL}</a>
              ) : (
                "none"
              )}
            </li>
            <li>
              Product:{" "}
              <Link
                className="text-[var(--studio-amber)] underline-offset-2 hover:underline"
                href="/"
              >
                {DISPLAY_NAME}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}
