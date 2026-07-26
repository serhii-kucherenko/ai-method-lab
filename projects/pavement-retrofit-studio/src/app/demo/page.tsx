import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open corridor packs",
    body: "Review the seeded urban arterial pack or create your own versioned pack.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Configure a corridor",
    body: "Capture route hint, traffic ceiling, and exposure floor for the soft-sim.",
    href: "/corridors",
  },
  {
    n: 3,
    title: "Configure a treatment",
    body: "Set TiO2 and durability floors for a photocatalytic overlay or sealcoat.",
    href: "/treatments",
  },
  {
    n: 4,
    title: "Record an assay",
    body: "Log NOx / CO2 proxies and assay signal for the emission soft-sim.",
    href: "/assays",
  },
  {
    n: 5,
    title: "Run dual compare",
    body: "Score photocatalytic_pavement_retrofit against conventional_preservation and check the scoreboard.",
    href: "/compare",
  },
];

export function DemoPage() {
  return (
    <StudioShell
      title="Demo"
      subtitle="Guided happy path for infrastructure / climate-road analytics leads."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-4 py-4">
            <p className="text-sm text-[var(--pr-amber)]">Step {s.n}</p>
            <h2 className="font-[family-name:var(--font-display)] text-xl">{s.title}</h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {s.body}
            </p>
            <Link href={s.href} className="mt-2 inline-block text-sm underline text-[var(--pr-teal)]">
              Open
            </Link>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
