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
    id: "create-case-pack",
    name: "Create case pack",
    actor: "Neuro-oncology imaging lead",
    job: "Record the anatomy region and soft-sim case assumptions.",
    steps: [
      "/cases — create a pack",
      "Add version and anatomy region",
      "Review pack status",
    ],
    success: "Case pack is listed with a version.",
    emptyError: "No packs — create the first case pack.",
    href: "/cases",
    cta: "Open cases",
  },
  {
    id: "define-report-schema",
    name: "Define report schema",
    actor: "Radiology AI method scientist",
    job: "Choose sections and collaborator vs solo weights.",
    steps: [
      "/schemas — define schema",
      "Set section list",
      "Review collaborator weight",
    ],
    success: "Schema names its sections and weights.",
    emptyError: "Need a case pack before adding schemas.",
    href: "/schemas",
    cta: "Open schemas",
  },
  {
    id: "configure-collaborators",
    name: "Configure multi-LLM collaborators",
    actor: "Report review lead",
    job: "Record a multi-LLM collaborator panel and success condition.",
    steps: [
      "/collaborators — create config",
      "Set success condition",
      "Link draft channel",
    ],
    success: "A collaborator config records the panel summary.",
    emptyError: "Need a case pack before adding collaborators.",
    href: "/collaborators",
    cta: "Open collaborators",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare multi-LLM collaborative draft with single-LLM baseline.",
    steps: [
      "/drafts — create a report draft",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success:
      "Compare reports multi_llm_collaborative or single_llm_baseline winner and gap.",
    emptyError: "Need schema, collaborator, and draft.",
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
      "Export case pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires ors-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for oncology-report soft-sim."
    >
      <ul className="space-y-6">
        {NAMED_FLOWS.map((flow) => (
          <li
            key={flow.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-ink)]">
              {flow.name}
            </h2>
            <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              <span className="font-medium">actor</span>: {flow.actor}
            </p>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              <span className="font-medium">job</span>: {flow.job}
            </p>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              <span className="font-medium">success</span>: {flow.success}
            </p>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              <span className="font-medium">emptyError</span>: {flow.emptyError}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              {flow.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <div className="mt-4">
              <Button asChild>
                <Link href={flow.href}>{flow.cta}</Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
