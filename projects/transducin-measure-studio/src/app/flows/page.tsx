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
    id: "create-measure-pack",
    name: "Create measure pack",
    actor: "Ophthalmology imaging / clinical-data lead",
    job: "Record the imaging target and soft-sim parser budget.",
    steps: [
      "/measures — create a pack",
      "Add version and imaging target",
      "Review pack status",
    ],
    success: "Measure pack is listed with a version.",
    emptyError: "No packs — create the first measure pack.",
    href: "/measures",
    cta: "Open measures",
  },
  {
    id: "configure-parsers",
    name: "Configure Optopol/Zeiss parsers",
    actor: "Imaging-interop engineer",
    job: "Define proprietary parser vendors and coverage spans.",
    steps: [
      "/parsers — define parser",
      "Set vendors and vendor count",
      "Review parser kind",
    ],
    success: "Parser names its vendors and coverage.",
    emptyError: "Need a measure pack before adding parsers.",
    href: "/parsers",
    cta: "Open parsers",
  },
  {
    id: "recover-dicom-sr",
    name: "Recover SNOMED-coded DICOM SR",
    actor: "Clinical-data engineer",
    job: "Record DICOM SR export gate text and success condition.",
    steps: [
      "/exports — create export",
      "Set success condition",
      "Link export channel",
    ],
    success: "An export records the SNOMED-coded SR ask.",
    emptyError: "Need a measure pack before adding exports.",
    href: "/exports",
    cta: "Open exports",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare SNOMED-coded OCT recovery with raw private-tag baseline.",
    steps: [
      "/runs — create a measure run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports SNOMED-coded or private-tag winner and gap.",
    emptyError: "Need parser, export, and run.",
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
      "Export measure pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires transducin-measure-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for SNOMED-coded OCT measure soft-sim."
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
