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
    id: "create-deck-pack",
    name: "Create deck pack",
    actor: "Lab automation lead",
    job: "Record the protocol scope and soft-sim tip budget.",
    steps: [
      "/decks — create a pack",
      "Add version and protocol scope",
      "Review pack status",
    ],
    success: "Deck pack is listed with a version.",
    emptyError: "No packs — create the first deck pack.",
    href: "/decks",
    cta: "Open decks",
  },
  {
    id: "define-assay-rules",
    name: "Define assay rules",
    actor: "Assay method scientist",
    job: "Choose assay constraints and assay vs runner weights.",
    steps: [
      "/assays — define rules",
      "Set rule list",
      "Review assay weight",
    ],
    success: "Assay names its rules and weights.",
    emptyError: "Need a deck pack before adding assays.",
    href: "/assays",
    cta: "Open assays",
  },
  {
    id: "configure-runtime-monitor",
    name: "Configure runtime monitor",
    actor: "Liquid-handling evaluation lead",
    job: "Record a monitor config and success condition.",
    steps: [
      "/monitors — create config",
      "Set success condition",
      "Link monitor channel",
    ],
    success: "A monitor config records the summary.",
    emptyError: "Need a deck pack before adding monitors.",
    href: "/monitors",
    cta: "Open monitors",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare assay-aware validation with naive protocol runner.",
    steps: [
      "/runs — create a guard run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success:
      "Compare reports assay_aware or naive_protocol_runner winner and gap.",
    emptyError: "Need assay, monitor, and run.",
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
      "Export deck pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires assay-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for assay-aware liquid-handling soft-sim."
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
