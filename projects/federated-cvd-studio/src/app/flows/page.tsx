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
    id: "create-cohort-pack",
    name: "Create cohort pack",
    actor: "Cardiology ML eng lead",
    job: "Record the cohort scope and soft-sim patient assumptions.",
    steps: [
      "/cohorts — create a pack",
      "Add version and cohort scope",
      "Review pack status",
    ],
    success: "Cohort pack is listed with a version.",
    emptyError: "No packs — create the first cohort pack.",
    href: "/cohorts",
    cta: "Open cohorts",
  },
  {
    id: "define-feature-schema",
    name: "Define feature schema",
    actor: "Digital health method scientist",
    job: "Choose CVD features and federation vs central weights.",
    steps: [
      "/features — define schema",
      "Set feature list",
      "Review federation weight",
    ],
    success: "Schema names its features and weights.",
    emptyError: "Need a cohort pack before adding schemas.",
    href: "/features",
    cta: "Open features",
  },
  {
    id: "configure-federation-sites",
    name: "Configure federation sites",
    actor: "Privacy / federation lead",
    job: "Record a hospital federation ring and success condition.",
    steps: [
      "/federation — create config",
      "Set success condition",
      "Link federation channel",
    ],
    success: "A federation config records the site summary.",
    emptyError: "Need a cohort pack before adding federation.",
    href: "/federation",
    cta: "Open federation",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare federated CVD risk with centralized baseline.",
    steps: [
      "/runs — create a CVD run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success:
      "Compare reports federated_cvd_risk or centralized_baseline winner and gap.",
    emptyError: "Need schema, federation, and run.",
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
      "Export cohort pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires fcvd-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for federated-cvd soft-sim."
    >
      <ul className="space-y-6">
        {NAMED_FLOWS.map((flow) => (
          <li
            key={flow.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl text-[var(--studio-ink)]">
              {flow.name}
            </h2>
            <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              <span className="font-medium">actor</span>: {flow.actor}
            </p>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              <span className="font-medium">job</span>: {flow.job}
            </p>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              <span className="font-medium">success</span>: {flow.success}
            </p>
            <p className="mt-1 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
              <span className="font-medium">empty / error</span>:{" "}
              {flow.emptyError}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[color-mix(in_srgb,var(--studio-ink)_60%,transparent)]">
              {flow.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <div className="mt-4">
              <Button asChild>
                <Link href={flow.href}>{flow.cta}</Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </StudioShell>
  );
}
