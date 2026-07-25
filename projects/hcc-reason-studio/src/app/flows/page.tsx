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
    id: "create-pathway-pack",
    name: "Create pathway pack",
    actor: "Hepatology decision-support lead",
    job: "Record the pathway scope and soft-sim case assumptions.",
    steps: [
      "/pathways — create a pack",
      "Add version and pathway scope",
      "Review pack status",
    ],
    success: "Pathway pack is listed with a version.",
    emptyError: "No packs — create the first pathway pack.",
    href: "/pathways",
    cta: "Open pathways",
  },
  {
    id: "define-risk-schema",
    name: "Define risk schema",
    actor: "Oncology method scientist",
    job: "Choose HCC cues and reasoning vs baseline weights.",
    steps: [
      "/schemas — define schema",
      "Set cue list",
      "Review reasoning weight",
    ],
    success: "Schema names its cues and weights.",
    emptyError: "Need a pathway pack before adding schemas.",
    href: "/schemas",
    cta: "Open schemas",
  },
  {
    id: "configure-clinical-reasoner",
    name: "Configure clinical reasoner",
    actor: "Clinical AI evaluation lead",
    job: "Record a clinical reasoner config and success condition.",
    steps: [
      "/reasoners — create config",
      "Set success condition",
      "Link reasoner channel",
    ],
    success: "A reasoner config records the summary.",
    emptyError: "Need a pathway pack before adding reasoners.",
    href: "/reasoners",
    cta: "Open reasoners",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare clinical-reasoning LLM with non-reasoning baseline.",
    steps: [
      "/runs — create an HCC run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success:
      "Compare reports clinical_reasoning or non_reasoning_baseline winner and gap.",
    emptyError: "Need schema, reasoner, and run.",
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
      "Export pathway pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires hcc-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for HCC clinical-reasoning soft-sim."
    >
      <div className="grid gap-4">
        {NAMED_FLOWS.map((flow) => (
          <article
            key={flow.id}
            className="row-lift rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
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
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              <strong>Empty:</strong> {flow.emptyError}
            </p>
            <Button asChild className="mt-4" variant="default">
              <Link href={flow.href}>{flow.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
