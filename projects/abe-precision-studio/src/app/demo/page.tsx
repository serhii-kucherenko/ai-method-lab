import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open an editor pack",
    body: "Create or open a versioned adenine editor pack on /packs.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Register an editor",
    body: "Add a therapeutic candidate or research-panel soft-sim editor.",
    href: "/editors",
  },
  {
    n: 3,
    title: "Configure domain-insertion ABE",
    body: "Specify insertion precision completeness and evidence floors.",
    href: "/insertions",
  },
  {
    n: 4,
    title: "Add a precision assay",
    body: "Capture baseline window breadth alongside window narrowing.",
    href: "/assays",
  },
  {
    n: 5,
    title: "Run A/B compare",
    body: "Compare domain_insertion_abe vs baseline_abe and review the scoreboard.",
    href: "/compare",
  },
];

export function DemoPage() {
  return (
    <StudioShell
      title="Demo"
      subtitle="Guided happy path: pack → editor → insertion → assay → dual compare."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-5 py-4">
            <p className="text-sm font-medium text-[var(--ap-teal)]">Step {s.n}</p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl">
              {s.title}
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {s.body}
            </p>
            <Link
              href={s.href}
              className="mt-3 inline-block text-sm underline text-[var(--ap-teal)]"
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
