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
    actor: "Process chemistry / route-design eng lead",
    job: "Record the target molecule and soft-sim candidate budget.",
    steps: [
      "/routes — create a pack",
      "Add version and target molecule",
      "Review pack status",
    ],
    success: "Route pack is listed with a version.",
    emptyError: "No packs — create the first route pack.",
    href: "/routes",
    cta: "Open routes",
  },
  {
    id: "run-retrosynthesis-candidates",
    name: "Run retrosynthesis candidates",
    actor: "Route design chemist",
    job: "Propose candidate routes with reaction classes and step counts.",
    steps: [
      "/candidates — define candidate",
      "Set reaction classes and steps",
      "Review candidate kind",
    ],
    success: "Candidate route names its classes and step count.",
    emptyError: "Need a route pack before adding candidates.",
    href: "/candidates",
    cta: "Open candidates",
  },
  {
    id: "apply-synthetic-confidence-score",
    name: "Apply synthetic confidence score",
    actor: "Process chemistry science lead",
    job: "Record Synthetic Confidence Score text and success condition.",
    steps: [
      "/scores — create score gate",
      "Set success condition",
      "Link score channel",
    ],
    success: "A confidence score records the gating ask.",
    emptyError: "Need a route pack before adding scores.",
    href: "/scores",
    cta: "Open scores",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare confidence-gated AI retrosynthesis with naive AI route baseline.",
    steps: [
      "/runs — create a synth run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports gated or naive winner and gap.",
    emptyError: "Need candidate, score, and run.",
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
    emptyError: "Auth requires synth-confidence-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for confidence-gated AI retrosynthesis soft-sim."
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
