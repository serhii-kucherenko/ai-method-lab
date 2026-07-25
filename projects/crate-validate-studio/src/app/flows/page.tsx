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
    id: "create-crate-pack",
    name: "Create crate pack",
    actor: "Research-data / FAIR tooling lead",
    job: "Record the FAIR target and soft-sim rule budget.",
    steps: [
      "/crates — create a pack",
      "Add version and FAIR target",
      "Review pack status",
    ],
    success: "Crate pack is listed with a version.",
    emptyError: "No packs — create the first crate pack.",
    href: "/crates",
    cta: "Open crates",
  },
  {
    id: "configure-rules",
    name: "Configure structural + semantic rules",
    actor: "RO-Crate / ARC validation engineer",
    job: "Define structural and semantic rule terms and coverage spans.",
    steps: [
      "/rules — define rule",
      "Set terms and term count",
      "Review rule kind",
    ],
    success: "Rule names its terms and coverage.",
    emptyError: "Need a crate pack before adding rules.",
    href: "/rules",
    cta: "Open rules",
  },
  {
    id: "run-frictionless-checks",
    name: "Run Frictionless-style checks",
    actor: "FAIR science lead",
    job: "Record check gate text and success condition.",
    steps: [
      "/checks — create check",
      "Set success condition",
      "Link check channel",
    ],
    success: "A check records the payload-aware ask.",
    emptyError: "Need a crate pack before adding checks.",
    href: "/checks",
    cta: "Open checks",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare ARC structural+semantic validation with metadata-only baseline.",
    steps: [
      "/runs — create a validation run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports ARC or metadata-only winner and gap.",
    emptyError: "Need rule, check, and run.",
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
      "Export crate pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires crate-validate-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for ARC RO-Crate validation soft-sim."
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
