import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open a birth pack",
    body: "Create or open a versioned caesarean birth pack on /packs.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Register a birth",
    body: "Add an elective or emergency caesarean soft-sim birth panel.",
    href: "/births",
  },
  {
    n: 3,
    title: "Configure weighed-swab method",
    body: "Specify swab/pad weigh method completeness and evidence floors.",
    href: "/methods",
  },
  {
    n: 4,
    title: "Add a haemoglobin assay",
    body: "Capture HB-delta coverage alongside swab mass fidelity.",
    href: "/assays",
  },
  {
    n: 5,
    title: "Run A/B compare",
    body: "Compare weighed_swab_measured vs haemoglobin_calculated and review the scoreboard.",
    href: "/compare",
  },
];

export function DemoPage() {
  return (
    <StudioShell
      title="Demo"
      subtitle="Guided happy path: pack → birth → method → assay → dual compare."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-5 py-4">
            <p className="text-sm font-medium text-[var(--bl-teal)]">Step {s.n}</p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl">
              {s.title}
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {s.body}
            </p>
            <Link
              href={s.href}
              className="mt-3 inline-block text-sm underline text-[var(--bl-teal)]"
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
