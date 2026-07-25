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
    id: "create-cohort-pack",
    name: "Create cohort pack",
    actor: "Population health / biobank ML lead",
    job: "Record the disease horizon and soft-sim query budget.",
    steps: [
      "/cohorts — create a pack",
      "Add version and disease horizon",
      "Review pack status",
    ],
    success: "Cohort pack is listed with a version.",
    emptyError: "No packs — create the first cohort pack.",
    href: "/cohorts",
    cta: "Open cohorts",
  },
  {
    id: "define-modality-schema",
    name: "Define modality schema",
    actor: "Multi-modal risk modeler",
    job: "Choose kind, feature set, and time window.",
    steps: [
      "/modalities — define schema",
      "Set features and time window",
      "Review modality kind",
    ],
    success: "Modality schema names its kind and feature band.",
    emptyError: "Need a cohort pack before adding modalities.",
    href: "/modalities",
    cta: "Open modalities",
  },
  {
    id: "author-risk-query",
    name: "Author risk query",
    actor: "Population health science lead",
    job: "Record query text and success condition.",
    steps: [
      "/queries — create query",
      "Set success condition",
      "Link disease channel",
    ],
    success: "A risk query records the shared representation ask.",
    emptyError: "Need a cohort pack before adding queries.",
    href: "/queries",
    cta: "Open queries",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare shared multi-disease representation with disease-specific baseline.",
    steps: [
      "/runs — create a shared run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports shared or disease-specific winner and gap.",
    emptyError: "Need modality, query, and run.",
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
      "Export cohort pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires shared-risk-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for shared multi-disease risk soft-sim."
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
