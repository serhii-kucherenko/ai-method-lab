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
    id: "create-study-pack",
    name: "Create study pack",
    actor: "Institutional research lead",
    job: "Record the domain focus and soft-sim gate budget.",
    steps: [
      "/studies — create a pack",
      "Add version and domain focus",
      "Review pack status",
    ],
    success: "Study pack is listed with a version.",
    emptyError: "No packs — create the first study pack.",
    href: "/studies",
    cta: "Open studies",
  },
  {
    id: "define-governance-gates",
    name: "Define governance gates",
    actor: "Governance / privacy lead",
    job: "Choose domain, checkpoint count, and privacy vs workflow weights.",
    steps: [
      "/gates — define gate",
      "Set privacy weight",
      "Review domain",
    ],
    success: "Gate names its domain and checkpoints.",
    emptyError: "Need a study pack before adding gates.",
    href: "/gates",
    cta: "Open gates",
  },
  {
    id: "configure-research-workflow",
    name: "Configure research workflow",
    actor: "Bioinformatics / workflow lead",
    job: "Record workflow summary and success condition.",
    steps: [
      "/workflows — create workflow",
      "Set success condition",
      "Link research channel",
    ],
    success: "A workflow records the summary.",
    emptyError: "Need a study pack before adding workflows.",
    href: "/workflows",
    cta: "Open workflows",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare governed end-to-end research with ungated agent baseline.",
    steps: [
      "/runs — create a research run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports governed or ungated winner and gap.",
    emptyError: "Need gate, workflow, and run.",
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
      "Export study pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires governed-research-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for governed end-to-end research soft-sim."
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
