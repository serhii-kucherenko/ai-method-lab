import Link from "next/link";
import { AUTHORS_CODE_URL, DISPLAY_NAME, PAPER_URL } from "@/claim";
import { StudioShell } from "@/components/studio-shell";

export default function HonestyPage() {
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this studio is — and what it is not."
    >
      <div className="space-y-6 rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-6 text-slate-700">
        <p>
          <strong>{DISPLAY_NAME}</strong> is a Method Lab soft-simulation for
          channel-aware quantization planning on edge CPUs. It is inspired by
          PolyQ&apos;s channel/compile co-design pattern. It is{" "}
          <strong>not</strong> PolyQ, not measured silicon, and not a production
          compiler.
        </p>
        <p>
          Dual scores compare channel-aware plan quality against a naive uniform
          bit-width baseline. Numbers are method-lab estimates for workflow
          learning — do not treat them as device benches.
        </p>
        <p>
          Authors&apos; public code for the source paper:{" "}
          {AUTHORS_CODE_URL ? (
            <a
              href={AUTHORS_CODE_URL}
              className="underline-offset-2 hover:underline"
            >
              {AUTHORS_CODE_URL}
            </a>
          ) : (
            <em>none published</em>
          )}
          .
        </p>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
            Sources
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Paper:{" "}
              <a
                href={PAPER_URL}
                target="_blank"
                rel="noreferrer"
                className="underline-offset-2 hover:underline"
              >
                {PAPER_URL}
              </a>
            </li>
            <li>
              Guide:{" "}
              <Link
                href="/docs/guides/62-edge-quant-studio-lessons.md"
                className="underline-offset-2 hover:underline"
              >
                62 — Edge Quant Studio lessons
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </StudioShell>
  );
}
