import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const STEPS = [
  {
    n: 1,
    title: "Open response packs",
    body: "Review the seeded pediatric-perinatal pack or create your own versioned pack.",
    href: "/packs",
  },
  {
    n: 2,
    title: "Configure an event",
    body: "Capture hazard hint, pediatric ceiling, and surge ceiling for the soft-sim.",
    href: "/events",
  },
  {
    n: 3,
    title: "Configure a liaison",
    body: "Set specialty coverage and handoff floors for pediatric-perinatal liaison.",
    href: "/liaisons",
  },
  {
    n: 4,
    title: "Record a handoff",
    body: "Log specialty → HQ latency and pediatric load for the assay.",
    href: "/handoffs",
  },
  {
    n: 5,
    title: "Run dual compare",
    body: "Score pediatric_perinatal_liaison against generic_disaster_hq and check the scoreboard.",
    href: "/compare",
  },
];

export function DemoPage() {
  return (
    <StudioShell
      title="Demo"
      subtitle="Guided happy path for public-health / emergency-ops analytics leads."
    >
      <ol className="space-y-4">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-lg border bg-white px-4 py-4">
            <p className="text-sm text-[var(--dl-amber)]">Step {s.n}</p>
            <h2 className="font-[family-name:var(--font-display)] text-xl">{s.title}</h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              {s.body}
            </p>
            <Link href={s.href} className="mt-2 inline-block text-sm underline text-[var(--dl-teal)]">
              Open
            </Link>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default DemoPage;
