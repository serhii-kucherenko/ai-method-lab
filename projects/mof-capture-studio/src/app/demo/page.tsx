import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open a water pack",
    body: "Create or open a versioned heavy-metal water pack on /packs.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Register a water",
    body: "Add an industrial effluent or mine-drainage soft-sim water panel.",
    href: "/waters",
  },
  {
    n: 3,
    title: "Configure anionic MOF sorbent",
    body: "Specify MOF ion-exchange completeness and evidence floors.",
    href: "/sorbents",
  },
  {
    n: 4,
    title: "Add a capture assay",
    body: "Capture conventional capacity alongside ion-exchange fidelity.",
    href: "/assays",
  },
  {
    n: 5,
    title: "Run A/B compare",
    body: "Compare anionic_mof_capture vs conventional_sorbent and review the scoreboard.",
    href: "/compare",
  },
];

export function DemoPage() {
  return (
    <StudioShell
      title="Demo"
      subtitle="Guided happy path: pack → water → sorbent → assay → dual compare."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-5 py-4">
            <p className="text-sm font-medium text-[var(--mc-teal)]">Step {s.n}</p>
            <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl">
              {s.title}
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {s.body}
            </p>
            <Link
              href={s.href}
              className="mt-3 inline-block text-sm underline text-[var(--mc-teal)]"
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
