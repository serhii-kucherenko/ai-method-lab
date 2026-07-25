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
    id: "create-compound-pack",
    name: "Create compound pack",
    actor: "PK / ADME modeling lead",
    job: "Record the indication focus and soft-sim compound budget.",
    steps: [
      "/compounds — create a pack",
      "Add version and indication focus",
      "Review pack status",
    ],
    success: "Compound pack is listed with a version.",
    emptyError: "No packs — create the first compound pack.",
    href: "/compounds",
    cta: "Open compounds",
  },
  {
    id: "compile-topology-graph",
    name: "Compile topology graph",
    actor: "PBPK modeler",
    job: "Choose domain, organ count, and structure vs topology weights.",
    steps: [
      "/topologies — compile graph",
      "Set structure weight and SMILES hint",
      "Review domain",
    ],
    success: "Topology names its domain and organ count.",
    emptyError: "Need a compound pack before adding topologies.",
    href: "/topologies",
    cta: "Open topologies",
  },
  {
    id: "configure-adme-models",
    name: "Configure ADME models",
    actor: "ADME science lead",
    job: "Record ADME summary and success condition.",
    steps: [
      "/adme — create config",
      "Set success condition",
      "Link ADME channel",
    ],
    success: "An ADME config records the summary.",
    emptyError: "Need a compound pack before adding ADME configs.",
    href: "/adme",
    cta: "Open ADME",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare structure-only topology-compiled PBPK with measured-lab baseline.",
    steps: [
      "/runs — create a PBPK run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports structure-only or measured-lab winner and gap.",
    emptyError: "Need topology, ADME, and run.",
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
      "Export compound pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires pbpk-structure-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for structure-only topology-compiled PBPK soft-sim."
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
