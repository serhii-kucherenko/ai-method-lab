import Link from "next/link";
import {
  CLAIM,
  DISPLAY_NAME,
  GUIDE_PATH,
  PAPER_ID,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty & Sources"
      subtitle="Method-lab fence for Enterprise Agent Studio."
    >
      <div className="space-y-8 text-slate-600">
        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
            Fence
          </h2>
          <p className="mt-3">
            {DISPLAY_NAME} is a soft simulation for studying multi-agent role
            orchestration on enterprise resource plans. It is{" "}
            <strong>not</strong> a production ERP, not a live planner, and not
            branded as Agentic ERP.
          </p>
          <p className="mt-3">{CLAIM}</p>
        </section>

        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
            Sources
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Paper {PAPER_ID}:{" "}
              <a
                className="text-[var(--studio-emerald)] underline underline-offset-4"
                href={PAPER_URL}
                target="_blank"
                rel="noreferrer"
              >
                {PAPER_URL}
              </a>
            </li>
            <li>Authors’ code: none published with the digest pick.</li>
            <li>
              Lab guide:{" "}
              <Link
                className="text-[var(--studio-emerald)] underline underline-offset-4"
                href={GUIDE_PATH}
              >
                {GUIDE_PATH}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </StudioShell>
  );
}
