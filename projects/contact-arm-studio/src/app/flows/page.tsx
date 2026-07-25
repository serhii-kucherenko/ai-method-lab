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
    id: "create-manipulator-pack", name: "Create manipulator pack", actor: "Robotics lead",
    job: "Record the arm, end-effector, and operating envelope for a soft-sim.",
    steps: ["/manipulators — create a pack", "Add version and arm profile", "Review pack status"],
    success: "Manipulator pack is listed with a version.", emptyError: "No packs — create the first manipulator pack.",
    href: "/manipulators", cta: "Open manipulators",
  },
  {
    id: "define-contact-plan", name: "Define contact plan", actor: "Manipulation engineer",
    job: "Choose contact points, approach intent, and pressure envelope.",
    steps: ["/contacts — define contact points", "/plans — assemble a plan", "Review contact intent"],
    success: "Contact plan names its contact points.", emptyError: "Need a manipulator pack and contact point first.",
    href: "/contacts", cta: "Open contacts",
  },
  {
    id: "attach-sensing-cues", name: "Attach tactile and vision cues", actor: "Perception engineer",
    job: "Record tactile+vision observations for a planned contact.",
    steps: ["/sensing — select plan", "Set tactile confidence", "Set vision confidence"],
    success: "A sensing run records both modalities.", emptyError: "Need a contact plan before adding sensing cues.",
    href: "/sensing", cta: "Open sensing",
  },
  {
    id: "contact-ab-compare", name: "Run contact A/B compare", actor: "Evaluation reviewer",
    job: "Compare contact-centric tactile+vision scoring with vision-only baseline.",
    steps: ["/sensing — create a run", "/compare — run A/B", "/scoreboard — inspect gaps"],
    success: "Compare reports contact_centric or vision_only winner and gap.", emptyError: "Need a plan, cues, and sensing run.",
    href: "/compare", cta: "Run compare",
  },
  {
    id: "export-webhook", name: "Export and webhook", actor: "Workspace admin",
    job: "Export plans and compare results, then connect a signed webhook.",
    steps: ["/settings — set secret and URL", "Export contact data", "Receive idempotent webhook"],
    success: "Exports download and signed events are accepted.", emptyError: "Auth requires cas-dev-token.",
    href: "/settings", cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for contact-planning soft-sim."
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
