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
    id: "create-chemistry-pack",
    name: "Create chemistry pack",
    actor: "Combustion / reacting-flow lead",
    job: "Record the mechanism family and species assumptions for a soft-sim.",
    steps: [
      "/chemistry — create a pack",
      "Add version and mechanism family",
      "Review pack status",
    ],
    success: "Chemistry pack is listed with a version.",
    emptyError: "No packs — create the first chemistry pack.",
    href: "/chemistry",
    cta: "Open chemistry",
  },
  {
    id: "import-rate-table",
    name: "Import rate table",
    actor: "Kinetics method scientist",
    job: "Choose species, reaction count, and surrogate vs full-rate weights.",
    steps: [
      "/rates — define rate table",
      "Set reaction count",
      "Review surrogate weight",
    ],
    success: "Rate table names its species and reaction count.",
    emptyError: "Need a chemistry pack before adding rates.",
    href: "/rates",
    cta: "Open rates",
  },
  {
    id: "configure-surrogate",
    name: "Configure entropy-constrained surrogate",
    actor: "Simulation reviewer",
    job: "Record an entropy-constrained surrogate case and success condition.",
    steps: [
      "/surrogates — create config",
      "Set success condition",
      "Link sim channel",
    ],
    success: "A surrogate config records the entropy summary.",
    emptyError: "Need a chemistry pack before adding surrogates.",
    href: "/surrogates",
    cta: "Open surrogates",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "Evaluation reviewer",
    job: "Compare entropy-constrained surrogate with full-rate baseline.",
    steps: [
      "/runs — create a kinetics run",
      "/compare — run A/B",
      "/scoreboard — inspect gaps",
    ],
    success:
      "Compare reports entropy_constrained or full_rate_baseline winner and gap.",
    emptyError: "Need rate table, surrogate, and kinetics run.",
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
      "Export chemistry pack data",
      "Receive idempotent webhook",
    ],
    success: "Exports download and signed events are accepted.",
    emptyError: "Auth requires ks-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for kinetics-surrogate soft-sim."
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
              <span className="font-medium">emptyError</span>: {flow.emptyError}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[color-mix(in_srgb,var(--studio-ink)_55%,transparent)]">
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
