import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open an allele pack",
    body: "Start from Packs and confirm the seed Usher 1B Allele Pack — or create your own versioned soft-sim context.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Review alleles and vectors",
    body: "Confirm MYO7A null panels and a MYO7A gene supplementation vector before scoring.",
    href: "/alleles",
  },
  {
    n: 3,
    title: "Check the pathway assay",
    body: "Inspect MYO7A rescue, Myo7b activation, and allele-gap signals on the seed assay.",
    href: "/assays",
  },
  {
    n: 4,
    title: "Run the dual compare",
    body: "Compare myo7a_gene_supplement vs myo7b_activation — watch for cases where allele gaps flip the winner.",
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
      subtitle="Guided walkthrough of the MYO7A supplementation vs Myo7b activation soft-sim path."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-5 py-4">
            <p className="text-sm text-[var(--ud-amber)]">Step {s.n}</p>
            <h2 className="font-[family-name:var(--font-display)] text-xl">{s.title}</h2>
            <p className="mt-1 text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {s.body}
            </p>
            <Link href={s.href} className="mt-2 inline-block text-sm underline text-[var(--ud-teal)]">
              Go
            </Link>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
