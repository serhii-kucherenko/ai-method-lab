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
    id: "create-sim-pack",
    name: "Create sim pack",
    actor: "Comp-chem / drug-design simulation lead",
    job: "Record the chem target and soft-sim force budget.",
    steps: [
      "/sims — create a pack",
      "Add version and chem target",
      "Review pack status",
    ],
    success: "Sim pack is listed with a version.",
    emptyError: "No packs — create the first sim pack.",
    href: "/sims",
    cta: "Open sims",
  },
  {
    id: "configure-fm-forces",
    name: "Configure foundation-model forces",
    actor: "Force-field / ML potential engineer",
    job: "Define FM force terms and coverage spans.",
    steps: [
      "/forces — define force",
      "Set terms and term count",
      "Review force kind",
    ],
    success: "Force config names its terms and coverage.",
    emptyError: "Need a sim pack before adding forces.",
    href: "/forces",
    cta: "Open forces",
  },
  {
    id: "run-trajectory",
    name: "Run trajectory",
    actor: "Simulation science lead",
    job: "Record trajectory gate text and success condition.",
    steps: [
      "/trajectories — create trajectory",
      "Set success condition",
      "Link trajectory channel",
    ],
    success: "A trajectory records the reactive ask.",
    emptyError: "Need a sim pack before adding trajectories.",
    href: "/trajectories",
    cta: "Open trajectories",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare foundation-model atomistics with classical force-field baseline.",
    steps: [
      "/runs — create an atomistic run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports FM or baseline winner and gap.",
    emptyError: "Need force, trajectory, and run.",
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
      "Export sim pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires atomistic-force-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for foundation-model atomistic soft-sim."
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
              Empty / error: {flow.emptyError}
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href={flow.href}>{flow.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
