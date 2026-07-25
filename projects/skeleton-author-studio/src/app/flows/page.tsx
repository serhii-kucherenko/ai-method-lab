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
    id: "create-experience-pack",
    name: "Create experience pack",
    actor: "Accessibility / data-viz lead",
    job: "Record the experience scope and soft-sim branch budget.",
    steps: [
      "/experiences — create a pack",
      "Add version and experience scope",
      "Review pack status",
    ],
    success: "Experience pack is listed with a version.",
    emptyError: "No packs — create the first experience pack.",
    href: "/experiences",
    cta: "Open experiences",
  },
  {
    id: "author-nav-skeleton",
    name: "Author navigation skeleton",
    actor: "Non-visual experience designer",
    job: "Choose navigation nodes and scaffold vs linear weights.",
    steps: [
      "/skeletons — define nodes",
      "Set scaffold weight",
      "Review node path",
    ],
    success: "Skeleton names its nodes and weights.",
    emptyError: "Need an experience pack before adding skeletons.",
    href: "/skeletons",
    cta: "Open skeletons",
  },
  {
    id: "edit-label-templates",
    name: "Edit label templates",
    actor: "Accessibility content lead",
    job: "Record spoken labels and success condition.",
    steps: [
      "/labels — create template",
      "Set success condition",
      "Link label channel",
    ],
    success: "A label template records the summary.",
    emptyError: "Need an experience pack before adding labels.",
    href: "/labels",
    cta: "Open labels",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare scaffolded visual authoring with naive linear baseline.",
    steps: [
      "/runs — create an author run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success:
      "Compare reports scaffolded_authoring or naive_linear winner and gap.",
    emptyError: "Need skeleton, labels, and run.",
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
      "Export experience pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires skeleton-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for scaffolded non-visual authoring soft-sim."
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
            <p className="text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              <strong>Empty / error:</strong> {flow.emptyError}
            </p>
            <Button asChild className="mt-4" size="sm">
              <Link href={flow.href}>{flow.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
