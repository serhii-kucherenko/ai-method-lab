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
    id: "create-campaign-pack",
    name: "Create campaign pack",
    actor: "Process chemistry / manufacturing lead",
    job: "Record the reaction focus and soft-sim loop budget.",
    steps: [
      "/campaigns — create a pack",
      "Add version and reaction focus",
      "Review pack status",
    ],
    success: "Campaign pack is listed with a version.",
    emptyError: "No packs — create the first campaign pack.",
    href: "/campaigns",
    cta: "Open campaigns",
  },
  {
    id: "define-reagent-space",
    name: "Define reagent space",
    actor: "Reaction condition modeler",
    job: "Choose family, solvent/catalyst sets, and temperature band.",
    steps: [
      "/reagents — define space",
      "Set solvents, catalysts, and temps",
      "Review family",
    ],
    success: "Reagent space names its family and condition band.",
    emptyError: "Need a campaign pack before adding reagents.",
    href: "/reagents",
    cta: "Open reagents",
  },
  {
    id: "configure-loop-policy",
    name: "Configure chemist-in-the-loop policy",
    actor: "Process chemistry science lead",
    job: "Record policy summary and success condition.",
    steps: [
      "/loops — create policy",
      "Set success condition",
      "Link gate channel",
    ],
    success: "A loop policy records the chemist gate.",
    emptyError: "Need a campaign pack before adding loops.",
    href: "/loops",
    cta: "Open loops",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare chemist-in-the-loop VLM with open-loop VLM baseline.",
    steps: [
      "/runs — create a reaction run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports chemist-in-loop or open-loop winner and gap.",
    emptyError: "Need reagent, loop, and run.",
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
      "Export campaign pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires reaction-loop-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for chemist-in-the-loop reaction soft-sim."
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
