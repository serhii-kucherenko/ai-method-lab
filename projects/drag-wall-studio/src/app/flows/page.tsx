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
    id: "create-channel-pack",
    name: "Create channel pack",
    actor: "Fluid-control lead",
    job: "Record the channel geometry and Reynolds assumptions for a soft-sim.",
    steps: [
      "/channels — create a pack",
      "Add version and channel model",
      "Review pack status",
    ],
    success: "Channel pack is listed with a version.",
    emptyError: "No packs — create the first channel pack.",
    href: "/channels",
    cta: "Open channels",
  },
  {
    id: "define-actuator-plan",
    name: "Define actuator plan",
    actor: "Controls engineer",
    job: "Choose wall zones, coverage, and actuation priority.",
    steps: [
      "/actuators — define wall zones",
      "Set coverage",
      "Review actuator intent",
    ],
    success: "Actuator plan names its wall zones.",
    emptyError: "Need a channel pack before adding actuators.",
    href: "/actuators",
    cta: "Open actuators",
  },
  {
    id: "attach-sensor-layout",
    name: "Attach sensor layout",
    actor: "Instrumentation engineer",
    job: "Record shear and pressure probes for closed-loop feedback.",
    steps: [
      "/sensors — create layout",
      "Set success condition",
      "Link to channel",
    ],
    success: "A sensor layout records probe coverage.",
    emptyError: "Need a channel pack before adding sensors.",
    href: "/sensors",
    cta: "Open sensors",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B controller compare",
    actor: "Evaluation reviewer",
    job: "Compare ES closed-loop wall control with open-loop/gradient baseline.",
    steps: [
      "/controllers — create a run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports es_closed_loop or open_loop_gradient winner and gap.",
    emptyError: "Need actuator, sensor, and controller run.",
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
      "Export channel data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires dws-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for drag-wall soft-sim."
    >
      <ul className="space-y-6">
        {NAMED_FLOWS.map((flow) => (
          <li
            key={flow.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
              {flow.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-medium">actor</span>: {flow.actor}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">job</span>: {flow.job}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">success</span>: {flow.success}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">emptyError</span>: {flow.emptyError}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-500">
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
