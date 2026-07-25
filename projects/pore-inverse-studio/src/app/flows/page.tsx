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
    id: "create-materials-pack",
    name: "Create materials pack",
    actor: "Materials / energy-storage lead",
    job: "Record the application focus and soft-sim pore budget.",
    steps: [
      "/materials — create a pack",
      "Add version and application focus",
      "Review pack status",
    ],
    success: "Materials pack is listed with a version.",
    emptyError: "No packs — create the first materials pack.",
    href: "/materials",
    cta: "Open materials",
  },
  {
    id: "define-pore-targets",
    name: "Define pore targets",
    actor: "Pore materials modeler",
    job: "Choose domain, pore diameter, and surface vs selectivity weights.",
    steps: [
      "/targets — define target",
      "Set diameter and metric hint",
      "Review domain",
    ],
    success: "Target names its domain and pore diameter.",
    emptyError: "Need a materials pack before adding targets.",
    href: "/targets",
    cta: "Open targets",
  },
  {
    id: "configure-inverse-designer",
    name: "Configure inverse designer",
    actor: "Inverse design science lead",
    job: "Record designer summary and success condition.",
    steps: [
      "/designers — create config",
      "Set success condition",
      "Link designer channel",
    ],
    success: "A designer config records the summary.",
    emptyError: "Need a materials pack before adding designers.",
    href: "/designers",
    cta: "Open designers",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare unified inverse design with naive generative baseline.",
    steps: [
      "/runs — create a pore run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports unified inverse or naive generative winner and gap.",
    emptyError: "Need target, designer, and run.",
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
      "Export materials pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires pore-inverse-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for unified nanoporous inverse design soft-sim."
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
