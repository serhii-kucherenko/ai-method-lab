import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open a carrier pack",
    body: "Start from the seeded HSN chemo-photothermal pack or create your own version.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Confirm carrier + load order",
    body: "Hollow mesoporous carrier and DTX-then-ICG sequence make pore fill intent explicit.",
    href: "/carriers",
  },
  {
    n: 3,
    title: "Run an assay soft-sim",
    body: "Capture order fidelity and encapsulation signals — soft-sim only.",
    href: "/assays",
  },
  {
    n: 4,
    title: "Compare ordered vs simultaneous",
    body: "Dual scorers show whether load order beats the simultaneous baseline.",
    href: "/compare",
  },
  {
    n: 5,
    title: "Export or invite",
    body: "Export JSON/CSV and invite evaluators from settings when the delta is clear.",
    href: "/settings",
  },
] as const;

export function DemoPage() {
  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps a stranger can complete to see ordered co-load soft-sim."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white p-4">
            <p className="text-xs uppercase tracking-wide text-[var(--co-amber)]">
              Step {s.n}
            </p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl">
              {s.title}
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {s.body}
            </p>
            <Link
              href={s.href}
              className="mt-3 inline-block text-sm underline text-[var(--co-slate)]"
            >
              Go
            </Link>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
