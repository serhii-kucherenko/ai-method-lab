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
    id: "create-route-pack",
    name: "Create route pack",
    actor: "Autonomy / AV stack lead",
    job: "Record the corridor focus and soft-sim route budget.",
    steps: [
      "/routes — create a pack",
      "Add version and corridor focus",
      "Review pack status",
    ],
    success: "Route pack is listed with a version.",
    emptyError: "No packs — create the first route pack.",
    href: "/routes",
    cta: "Open routes",
  },
  {
    id: "configure-world-forecast",
    name: "Configure world forecast",
    actor: "World-model engineer",
    job: "Choose corridor, forecast horizon, and world vs action weights.",
    steps: [
      "/worlds — define forecast",
      "Set world weight",
      "Review corridor",
    ],
    success: "World config names its corridor and horizon.",
    emptyError: "Need a route pack before adding worlds.",
    href: "/worlds",
    cta: "Open worlds",
  },
  {
    id: "configure-action-policy",
    name: "Configure action policy",
    actor: "Policy / planning lead",
    job: "Record action summary and success condition.",
    steps: [
      "/policies — create policy",
      "Set success condition",
      "Link action channel",
    ],
    success: "An action policy records the summary.",
    emptyError: "Need a route pack before adding policies.",
    href: "/policies",
    cta: "Open policies",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare dual-level world-cognitive VLA with single-level VLA baseline.",
    steps: [
      "/runs — create a drive run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success:
      "Compare reports world_cognitive or single_level winner and gap.",
    emptyError: "Need world, policy, and run.",
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
      "Export route pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires world-cog-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for dual-level world-cognitive driving soft-sim."
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
