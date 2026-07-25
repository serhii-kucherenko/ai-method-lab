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
    id: "create-case-pack",
    name: "Create case pack",
    actor: "Surgical imaging lead",
    job: "Record the anatomy focus and soft-sim scan budget.",
    steps: [
      "/cases — create a pack",
      "Add version and anatomy focus",
      "Review pack status",
    ],
    success: "Case pack is listed with a version.",
    emptyError: "No packs — create the first case pack.",
    href: "/cases",
    cta: "Open cases",
  },
  {
    id: "import-specimen-scan",
    name: "Import specimen scan",
    actor: "Imaging / pathology tech lead",
    job: "Choose domain, slice count, and surface vs deformable weights.",
    steps: [
      "/specimens — import scan",
      "Set surface weight",
      "Review domain",
    ],
    success: "Specimen names its domain and slices.",
    emptyError: "Need a case pack before adding specimens.",
    href: "/specimens",
    cta: "Open specimens",
  },
  {
    id: "configure-deformable-fusion",
    name: "Configure deformable fusion",
    actor: "AR / registration lead",
    job: "Record fusion summary and success condition.",
    steps: [
      "/fusions — create config",
      "Set success condition",
      "Link fusion channel",
    ],
    success: "A fusion config records the summary.",
    emptyError: "Need a case pack before adding fusions.",
    href: "/fusions",
    cta: "Open fusions",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare marker-free deformable fusion with marker-based baseline.",
    steps: [
      "/runs — create a margin run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports marker-free or marker-based winner and gap.",
    emptyError: "Need specimen, fusion, and run.",
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
      "Export case pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires margin-fusion-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for marker-free margin fusion soft-sim."
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
