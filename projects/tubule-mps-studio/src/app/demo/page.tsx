import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open a tubule pack",
    body: "Start from Packs and confirm the seed Proximal Tubule Pack — or create your own versioned soft-sim context.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Review tubules and regimens",
    body: "Confirm perfused proximal-tubule segments and a voclosporin MPS regimen before scoring.",
    href: "/tubules",
  },
  {
    n: 3,
    title: "Check the mitochondrial assay",
    body: "Inspect MPS preservation, cyclosporine harm, and 2D culture masking on the seed assay.",
    href: "/assays",
  },
  {
    n: 4,
    title: "Run the dual compare",
    body: "Compare voclosporin_mps vs cyclosporine_mps — watch for cases where 2D masking hides harm.",
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
      subtitle="Guided walkthrough of the voclosporin MPS vs cyclosporine A soft-sim path."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-5 py-4">
            <p className="text-sm text-[var(--tm-amber)]">Step {s.n}</p>
            <h2 className="font-[family-name:var(--font-display)] text-xl">{s.title}</h2>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {s.body}
            </p>
            <Link href={s.href} className="mt-2 inline-block text-sm underline text-[var(--tm-teal)]">
              Go
            </Link>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
