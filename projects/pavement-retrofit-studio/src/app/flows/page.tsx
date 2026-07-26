import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const FLOWS = [
  {
    name: "Create corridor pack",
    actor: "Owner",
    job: "Version a photocatalytic soft-sim pack",
    pages: "/packs → /settings",
    success: "Pack listed and auditable",
    empty: "Search returns zero — create from the form",
  },
  {
    name: "Configure photocatalytic treatment",
    actor: "Evaluator",
    job: "Set TiO2 floors and material hints",
    pages: "/treatments",
    success: "Treatment active on the pack",
    empty: "Missing pack id → pack_not_found",
  },
  {
    name: "Configure emission assay",
    actor: "Evaluator",
    job: "Capture NOx / CO2 proxies and assay signal",
    pages: "/assays",
    success: "Assay active on corridor + treatment",
    empty: "Missing corridor/treatment → deps_not_found",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "Score photocatalytic retrofit vs conventional preservation",
    pages: "/corridors → /compare → /scoreboard",
    success: "Winner + gap on scoreboard",
    empty: "No compares yet — run from Compare",
  },
  {
    name: "Export + webhook",
    actor: "Owner",
    job: "Ship pack JSON/CSV and ingest webhook",
    pages: "/settings",
    success: "Export length ack + webhook audit row",
    empty: "Unauthorized without bearer token",
  },
];

export function FlowsPage() {
  return (
    <StudioShell
      title="Flows"
      subtitle="Five sophisticated journeys for infrastructure / climate-road analytics leads."
    >
      <div className="space-y-4">
        {FLOWS.map((f) => (
          <article key={f.name} className="rounded-lg border bg-white px-4 py-4">
            <h2 className="font-[family-name:var(--font-display)] text-xl">{f.name}</h2>
            <p className="mt-2 text-sm">
              <span className="font-medium">Actor:</span> {f.actor}
            </p>
            <p className="text-sm">
              <span className="font-medium">Job:</span> {f.job}
            </p>
            <p className="text-sm">
              <span className="font-medium">Pages:</span> {f.pages}
            </p>
            <p className="text-sm">
              <span className="font-medium">Success:</span> {f.success}
            </p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              Empty/error: {f.empty}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm">
        <Link href="/demo" className="underline text-[var(--pr-teal)]">
          Guided demo
        </Link>
      </p>
    </StudioShell>
  );
}

export default FlowsPage;
