import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open the seed impact pack",
    body: "Go to Packs and review the SSA childhood immunization soft-sim pack.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Inspect country and antigen drafts",
    body: "Confirm Kenya panel and DTP3 antigen specs before scoring.",
    href: "/countries",
  },
  {
    n: 3,
    title: "Review the mortality panel",
    body: "Check DTP3 / measles coverage and under-five mortality index on Panels.",
    href: "/panels",
  },
  {
    n: 4,
    title: "Run dual A/B compare",
    body: "Compare immunization_linked_mortality against coverage_only_dashboard.",
    href: "/compare",
  },
  {
    n: 5,
    title: "Read the scoreboard",
    body: "Lock only when linked mortality beats coverage-only with honesty intact.",
    href: "/scoreboard",
  },
];

export function DemoPage() {
  return (
    <StudioShell
      title="Guided demo"
      subtitle="Complete this soft-sim path in a few minutes — no live immunization logistics claimed."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-4 py-4">
            <p className="text-sm text-[var(--ii-teal)]">Step {s.n}</p>
            <h2 className="font-semibold">{s.title}</h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {s.body}
            </p>
            <Link href={s.href} className="mt-2 inline-block text-sm underline text-[var(--ii-teal)]">
              Go
            </Link>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
