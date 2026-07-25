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
    id: "create-workflow-pack",
    name: "Create workflow pack",
    actor: "Computational chemistry / platform lead",
    job: "Record the chemistry focus and soft-sim rule budget.",
    steps: [
      "/workflows — create a pack",
      "Add version and chemistry focus",
      "Review pack status",
    ],
    success: "Workflow pack is listed with a version.",
    emptyError: "No packs — create the first workflow pack.",
    href: "/workflows",
    cta: "Open workflows",
  },
  {
    id: "define-trace-rules",
    name: "Define trace-state rules",
    actor: "Chemistry workflow modeler",
    job: "Choose domain, from/to states, and allow vs deny weights.",
    steps: [
      "/rules — define rule",
      "Set ASP transition and metric hint",
      "Review domain",
    ],
    success: "Rule names its domain and ASP transition.",
    emptyError: "Need a workflow pack before adding rules.",
    href: "/rules",
    cta: "Open rules",
  },
  {
    id: "configure-recovery-actions",
    name: "Configure recovery actions",
    actor: "Agentic chemistry science lead",
    job: "Record recovery summary and success condition.",
    steps: [
      "/recoveries — create config",
      "Set success condition",
      "Link recovery channel",
    ],
    success: "A recovery config records the summary.",
    emptyError: "Need a workflow pack before adding recoveries.",
    href: "/recoveries",
    cta: "Open recoveries",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare typed trace-state validation with ungated agent baseline.",
    steps: [
      "/runs — create a trace run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports typed-trace or ungated winner and gap.",
    emptyError: "Need rule, recovery, and run.",
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
      "Export workflow pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires chem-trace-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for typed-trace agentic chemistry soft-sim."
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
