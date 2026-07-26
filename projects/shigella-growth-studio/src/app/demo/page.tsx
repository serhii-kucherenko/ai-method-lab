import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  { n: 1, title: "Open a cohort pack", href: "/packs", body: "Create or pick a versioned soft-sim pack." },
  { n: 2, title: "Set cohort + episode", href: "/cohorts", body: "Age band and Shigella episode floors." },
  { n: 3, title: "Add a growth assay", href: "/growth", body: "HAZ or velocity soft-sim signals." },
  { n: 4, title: "Run dual compare", href: "/compare", body: "Antibiotic-treated vs untreated growth." },
  { n: 5, title: "Review scoreboard", href: "/scoreboard", body: "Lock only when antibiotic path wins with honesty." },
];

export function DemoPage() {
  return (
    <StudioShell
      title="Guided demo"
      subtitle="Five steps from pack to lock-ready compare — soft-sim only."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-4 py-4">
            <p className="text-sm text-[var(--sg-amber)]">Step {s.n}</p>
            <Link href={s.href} className="text-lg font-semibold text-[var(--sg-teal)] underline">
              {s.title}
            </Link>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {s.body}
            </p>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
