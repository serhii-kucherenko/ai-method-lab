import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create cohort pack",
    href: "/packs",
    body: "Version a soft-sim pack for child diarrhea growth impact.",
  },
  {
    name: "Configure Shigella episode",
    href: "/episodes",
    body: "Set confirmation and antibiotic floors for episode soft-sim.",
  },
  {
    name: "Configure growth assay",
    href: "/growth",
    body: "Capture HAZ delta, velocity, and wasting-risk signals.",
  },
  {
    name: "Run A/B compare",
    href: "/compare",
    body: "Score antibiotic_treated_shigella against untreated_diarrhea_growth.",
  },
  {
    name: "Export + webhook",
    href: "/settings",
    body: "Export packs/compares and ingest signed webhook events.",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated flows — packs → episodes → growth → compare → export."
    >
      <ol className="space-y-4">
        {FLOWS.map((f, i) => (
          <li key={f.name} className="rounded-lg border bg-white px-4 py-4">
            <p className="text-sm text-[var(--sg-amber)]">Flow {i + 1}</p>
            <Link
              href={f.href}
              className="font-[family-name:var(--font-display)] text-xl text-[var(--sg-teal)] underline"
            >
              {f.name}
            </Link>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {f.body}
            </p>
          </li>
        ))}
      </ol>
    </StudioShell>
  );
}

export default FlowsPage;
