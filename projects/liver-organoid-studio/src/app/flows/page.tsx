import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

const FLOWS = [
  {
    name: "Create model pack",
    actor: "Organoid-platform lead",
    job: "Version a MASLD soft-sim pack before any score.",
    steps: ["/packs → create → search/archive"],
    success: "Active pack appears in the registry.",
    failure: "Missing label/version blocks create.",
    href: "/packs",
  },
  {
    name: "Configure lineage mix",
    actor: "Screening analytics eng",
    job: "Make hepatocyte / stellate / cholangiocyte floors explicit.",
    steps: ["/lineages → create mix → review"],
    success: "Lineage row with mix hint is active.",
    failure: "Bad pack id returns error.",
    href: "/lineages",
  },
  {
    name: "Configure MASLD assay",
    actor: "MASLD screening lead",
    job: "Capture lipid + inflammation soft-sim phenotype.",
    steps: ["/masld → create case → /assays soft-sim"],
    success: "MASLD case + assay run exist for the pack.",
    failure: "Empty phenotype leaves soft-sim under-specified.",
    href: "/masld",
  },
  {
    name: "Run A/B compare",
    actor: "Evaluator",
    job: "Compare multicellular HLO vs single-lineage HLC.",
    steps: ["/compare → run → /scoreboard"],
    success: "Winner + gap recorded; scoreboard updates.",
    failure: "Missing seed refs returns bad_refs.",
    href: "/compare",
  },
  {
    name: "Export + webhook",
    actor: "Org owner",
    job: "Export packs/compares and wire HMAC ingest.",
    steps: ["/settings → export JSON/CSV → webhook secret"],
    success: "Export payload size shown; audit records updates.",
    failure: "Unauthorized without bearer token.",
    href: "/settings",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for multicellular liver organoid MASLD soft-sim — not a single happy path."
    >
      <ul className="space-y-5">
        {FLOWS.map((f) => (
          <li key={f.name} className="rounded-lg border bg-white p-5">
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--lo-rust)]">
              {f.name}
            </h2>
            <p className="mt-1 text-sm">
              <strong>Actor:</strong> {f.actor}
            </p>
            <p className="text-sm">
              <strong>Job:</strong> {f.job}
            </p>
            <p className="text-sm">
              <strong>Steps:</strong> {f.steps}
            </p>
            <p className="text-sm">
              <strong>Success:</strong> {f.success}
            </p>
            <p className="text-sm">
              <strong>Failure:</strong> {f.failure}
            </p>
            <Link href={f.href} className="mt-3 inline-block">
              <Button type="button">Start flow</Button>
            </Link>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}

export default FlowsPage;
