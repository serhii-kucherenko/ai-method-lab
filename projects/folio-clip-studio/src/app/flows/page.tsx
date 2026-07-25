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
    id: "create-clip-pack",
    name: "Create clip pack",
    actor: "AgTech / crop-health product eng lead",
    job: "Record the crop target and soft-sim sensor budget.",
    steps: [
      "/clips — create a pack",
      "Add version and crop target",
      "Review pack status",
    ],
    success: "Clip pack is listed with a version.",
    emptyError: "No packs — create the first clip pack.",
    href: "/clips",
    cta: "Open clips",
  },
  {
    id: "configure-multimodal-sensors",
    name: "Configure multimodal sensors",
    actor: "Crop-health sensing engineer",
    job: "Define wearable sensor channels and coverage spans.",
    steps: [
      "/sensors — define sensor",
      "Set channels and channel count",
      "Review sensor kind",
    ],
    success: "Sensor config names its channels and coverage.",
    emptyError: "Need a clip pack before adding sensors.",
    href: "/sensors",
    cta: "Open sensors",
  },
  {
    id: "run-stress-detection",
    name: "Run stress detection",
    actor: "Crop-health science lead",
    job: "Record plant-stress signal text and success condition.",
    steps: [
      "/stress — create stress signal",
      "Set success condition",
      "Link stress channel",
    ],
    success: "A stress signal records the detection ask.",
    emptyError: "Need a clip pack before adding stress signals.",
    href: "/stress",
    cta: "Open stress",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare multimodal wearable stress sensing with single-sensor baseline.",
    steps: [
      "/runs — create a clip run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success: "Compare reports multimodal or baseline winner and gap.",
    emptyError: "Need sensor, stress, and run.",
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
      "Export clip pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires folio-clip-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for multimodal plant-stress wearable soft-sim."
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
