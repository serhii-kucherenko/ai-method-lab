import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open a screen pack",
    body: "Start from Packs and confirm the seed PfDHODH Screen Pack — or create your own versioned soft-sim context.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Review screens and hits",
    body: "Confirm docking + pharmacophore screens and a structure-based DHODH hit before scoring.",
    href: "/screens",
  },
  {
    n: 3,
    title: "Check the DHODH assay",
    body: "Inspect docking fit, library hit rate, and pharmacophore-match signals on the seed assay.",
    href: "/assays",
  },
  {
    n: 4,
    title: "Run the dual compare",
    body: "Compare structure_based_dhodh vs naive_library_baseline — watch for cases where lookalikes flip the winner.",
    href: "/compare",
  },
  {
    n: 5,
    title: "Read the scoreboard + honesty",
    body: "Rank winners on the scoreboard, then read the honesty fence before any soft-sim lock.",
    href: "/scoreboard",
  },
];

export function DemoPage() {
  return (
    <StudioShell
      title="Demo"
      subtitle="Guided walkthrough of the structure-based vs naive library PfDHODH soft-sim path."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-5 py-4">
            <p className="text-sm text-[var(--ds-amber)]">Step {s.n}</p>
            <h2 className="font-[family-name:var(--font-display)] text-xl">{s.title}</h2>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {s.body}
            </p>
            <Link href={s.href} className="mt-2 inline-block text-sm underline text-[var(--ds-teal)]">
              Go
            </Link>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
