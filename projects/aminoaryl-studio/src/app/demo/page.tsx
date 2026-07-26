import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open a route pack",
    body: "Start from Packs and confirm the seed 1,3-Aminoarylation Route Pack — or create your own versioned soft-sim context.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Review routes and catalysts",
    body: "Confirm aryl cyclopropane routes and a photocatalytic aminoaryl catalyst before scoring.",
    href: "/routes",
  },
  {
    n: 3,
    title: "Check the aminoarylation assay",
    body: "Inspect photo yield, copper yield, and cyclopropane-strain signals on the seed assay.",
    href: "/assays",
  },
  {
    n: 4,
    title: "Run the dual compare",
    body: "Compare photocatalytic_aminoaryl vs copper_catalyzed_aminoaryl — watch for cases where strain flips the winner.",
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
      subtitle="Guided walkthrough of the photocatalytic vs copper-catalyzed aminoarylation soft-sim path."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-5 py-4">
            <p className="text-sm text-[var(--aa-amber)]">Step {s.n}</p>
            <h2 className="font-[family-name:var(--font-display)] text-xl">{s.title}</h2>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {s.body}
            </p>
            <Link href={s.href} className="mt-2 inline-block text-sm underline text-[var(--aa-teal)]">
              Go
            </Link>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
