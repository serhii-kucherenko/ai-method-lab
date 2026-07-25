import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";
import { Button } from "@/components/ui/button";

export type NamedFlow = {
  id: string;
  name: string;
  actor: string;
  job: string;
  steps: string[];
  success: string;
  emptyError: string;
  href: string;
  cta: string;
};

export const NAMED_FLOWS: NamedFlow[] = [
  {
    id: "create-panel-pack",
    name: "Create panel pack",
    actor: "Clinical genomics / variant interpretation eng lead",
    job: "Record the gene panel and soft-sim probe budget.",
    steps: [
      "/panels — create a pack",
      "Add version and gene panel",
      "Review pack status",
    ],
    success: "Panel pack is listed with a version.",
    emptyError: "No packs — create the first panel pack.",
    href: "/panels",
    cta: "Open panels",
  },
  {
    id: "configure-interpretable-probe",
    name: "Configure interpretable probe",
    actor: "Genomic FM probe engineer",
    job: "Choose kind, embedding axis, and interpret layer.",
    steps: [
      "/probes — define probe",
      "Set embedding axis and layer",
      "Review probe kind",
    ],
    success: "Probe config names its axis and interpret layer.",
    emptyError: "Need a panel pack before adding probes.",
    href: "/probes",
    cta: "Open probes",
  },
  {
    id: "link-biological-mechanisms",
    name: "Link biological mechanisms",
    actor: "Variant interpretation science lead",
    job: "Record mechanism text and success condition.",
    steps: [
      "/mechanisms — create link",
      "Set success condition",
      "Link pathway channel",
    ],
    success: "A mechanism link records the biological attribution ask.",
    emptyError: "Need a panel pack before adding mechanisms.",
    href: "/mechanisms",
    cta: "Open mechanisms",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare interpretable FM probe with opaque pathogenicity baseline.",
    steps: [
      "/runs — create a variant run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports probe or opaque winner and gap.",
    emptyError: "Need probe, mechanism, and run.",
    href: "/compare",
    cta: "Run compare",
  },
  {
    id: "export-webhook",
    name: "Export and webhook",
    actor: "Workspace admin",
    job: "Export packs and compare results, then connect a signed webhook.",
    steps: [
      "/settings — set secret and URL",
      "Export panel pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires variant-probe-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for interpretable genomic FM probe soft-sim."
    >
      <div className="grid gap-4">
        {NAMED_FLOWS.map((flow) => (
          <article
            key={flow.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl">
              {flow.name}
            </h2>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              <span className="font-medium text-[var(--studio-ink)]">
                {flow.actor}
              </span>{" "}
              — {flow.job}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
              {flow.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <p className="mt-3 text-sm">
              <strong>Success:</strong> {flow.success}
            </p>
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              <strong>Empty / error:</strong> {flow.emptyError}
            </p>
            <Button asChild className="mt-4">
              <Link href={flow.href}>{flow.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
