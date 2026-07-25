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
    actor: "Medicinal chemistry lead",
    job: "Record the design scope and soft-sim sample budget.",
    steps: [
      "/campaigns — create a pack",
      "Add version and design scope",
      "Review pack status",
    ],
    success: "Campaign pack is listed with a version.",
    emptyError: "No packs — create the first campaign pack.",
    href: "/campaigns",
    cta: "Open campaigns",
  },
  {
    id: "define-property-targets",
    name: "Define property targets",
    actor: "Generative design scientist",
    job: "Choose property windows and efficiency vs baseline weights.",
    steps: [
      "/targets — define target",
      "Set property list",
      "Review efficiency weight",
    ],
    success: "Target names its properties and weights.",
    emptyError: "Need a campaign pack before adding targets.",
    href: "/targets",
    cta: "Open targets",
  },
  {
    id: "configure-sample-efficient-optimizer",
    name: "Configure sample-efficient optimizer",
    actor: "Generative AI evaluation lead",
    job: "Record an optimizer config and success condition.",
    steps: [
      "/optimizers — create config",
      "Set success condition",
      "Link optimizer channel",
    ],
    success: "An optimizer config records the summary.",
    emptyError: "Need a campaign pack before adding optimizers.",
    href: "/optimizers",
    cta: "Open optimizers",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare sample-efficient optimization with naive generative baseline.",
    steps: [
      "/runs — create a sample run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success:
      "Compare reports sample_efficient or naive_generative_baseline winner and gap.",
    emptyError: "Need target, optimizer, and run.",
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
    emptyError: "Auth requires mol-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for sample-efficient molecular design soft-sim."
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
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
              <strong>Empty:</strong> {flow.emptyError}
            </p>
            <Button asChild className="mt-4" variant="default">
              <Link href={flow.href}>{flow.cta}</Link>
            </Button>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}
