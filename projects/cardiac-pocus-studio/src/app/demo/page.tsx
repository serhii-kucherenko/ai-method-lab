import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  "Open Packs and create a versioned COPD POCUS exam pack.",
  "Add an exam with cardiac windows and probe/view floors.",
  "Configure a cardiac POCUS COPD pattern (e.g. RV strain).",
  "Create a detection assay with cardiac and lung signals.",
  "Run Compare — lock only when cardiac beats lung with honesty.",
];

export function DemoPage() {
  return (
    <StudioShell
      title="Guided demo"
      subtitle="Walk the soft-sim happy path from exam pack to dual compare."
    >
      <ol className="space-y-4">
        {STEPS.map((step, i) => (
          <li key={step} className="rounded-lg border bg-white px-4 py-4">
            <p className="text-sm text-[var(--cp-amber)]">Step {i + 1}</p>
            <p className="mt-1">{step}</p>
          </li>
        ))}
      </ol>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/packs" className="rounded-md bg-[var(--cp-teal)] px-4 py-2 text-sm text-white">
          Start at packs
        </Link>
        <Link href="/compare" className="rounded-md border px-4 py-2 text-sm">
          Jump to compare
        </Link>
      </div>
    </StudioShell>
  );
}

export default DemoPage;
