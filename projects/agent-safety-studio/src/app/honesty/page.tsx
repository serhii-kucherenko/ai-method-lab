import Link from "next/link";
import {
  AUTHORS_CODE_URL,
  CLAIM,
  DISPLAY_NAME,
  GUIDE_PATH,
  PAPER_URL,
} from "@/claim";
import { StudioShell } from "@/components/studio-shell";
import { listFeatures } from "@/store";

export default function HonestyPage() {
  const features = listFeatures();
  return (
    <StudioShell
      title="Honesty fence"
      subtitle="What this product is — and what it is not."
    >
      <div className="space-y-8">
        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Claim
          </h2>
          <p className="mt-2 text-stone-600">{CLAIM}</p>
          <p className="mt-4 text-sm text-stone-500">
            Soft simulation for method-lab evaluation. Not a live agent control
            plane. Not a production IFG / ControlArena deployment. Never branded
            as IFG.
          </p>
        </section>

        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Sources
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-stone-600">
            <li>
              Paper:{" "}
              <a
                className="text-[var(--studio-amber)] underline-offset-4 hover:underline"
                href={PAPER_URL}
                target="_blank"
                rel="noreferrer"
              >
                {PAPER_URL}
              </a>
            </li>
            <li>
              Authors&apos; code:{" "}
              {AUTHORS_CODE_URL ? (
                <a href={AUTHORS_CODE_URL}>{AUTHORS_CODE_URL}</a>
              ) : (
                "none published with this paper"
              )}
            </li>
            <li>
              Product: <code>projects/agent-safety-studio/</code>
            </li>
            <li>
              Guide:{" "}
              <Link
                href={GUIDE_PATH}
                className="text-[var(--studio-amber)] underline-offset-4 hover:underline"
              >
                {GUIDE_PATH}
              </Link>
            </li>
          </ul>
        </section>

        <section className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5">
          <h2 className="font-[family-name:var(--font-display)] text-xl text-stone-900">
            Feature inventory ({features.length})
          </h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-stone-600">
            {features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ol>
        </section>

        <p className="text-sm text-stone-500">
          Display name: <strong>{DISPLAY_NAME}</strong>
        </p>
      </div>
    </StudioShell>
  );
}
