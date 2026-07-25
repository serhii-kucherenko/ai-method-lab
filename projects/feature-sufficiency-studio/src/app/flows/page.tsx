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
    id: "create-feature-pack",
    name: "Create feature pack",
    actor: "Eval lead",
    job: "Stand up a versioned clinical feature catalog for sufficiency soft-sim.",
    steps: [
      "/settings — confirm org",
      "/features — create pack with domain + version",
      "Note feature count for later masks",
    ],
    success: "Feature pack listed under /features with version.",
    emptyError: "Empty registry — create first pack on /features.",
    href: "/features",
    cta: "Open features",
  },
  {
    id: "define-observation-mask",
    name: "Define observation mask",
    actor: "Feature taxonomist",
    job: "Declare which features are present under partial observation.",
    steps: [
      "/masks — select pack",
      "List present features + coverage ratio",
      "Set salience hint for the mask",
    ],
    success: "Active observation mask with coverage ratio.",
    emptyError: "Need pack selected — create one on /features first.",
    href: "/masks",
    cta: "Open masks",
  },
  {
    id: "add-cohort-case",
    name: "Add cohort case",
    actor: "Eval engineer",
    job: "Author a cohort case with gold outcome and segment.",
    steps: [
      "/cohorts — add case",
      "Set gold outcome label",
      "Attach cohort segment filter",
    ],
    success: "Case visible with gold outcome and searchable summary.",
    emptyError: "No cases — add the first cohort on /cohorts.",
    href: "/cohorts",
    cta: "Open cohorts",
  },
  {
    id: "ab-sufficiency-compare",
    name: "Run A/B sufficiency compare",
    actor: "Release reviewer",
    job: "Falsify partial-observation sufficiency vs full-feature baseline.",
    steps: [
      "/sufficiency — create a run",
      "/compare — run A vs B",
      "/scoreboard — read delta winners",
    ],
    success:
      "Compare with winner partial_observation | full_feature | tie + gap.",
    emptyError: "Need mask + cohort + run — empty prompt links back.",
    href: "/compare",
    cta: "Run compare",
  },
  {
    id: "export-webhook",
    name: "Export + webhook",
    actor: "Org admin",
    job: "Export packs JSON and wire HMAC webhook for compare events.",
    steps: [
      "/settings — set webhook secret/URL",
      "Invite a member",
      "Export packs JSON / compares CSV",
    ],
    success: "Export downloads; webhook accepts signed idempotent POSTs.",
    emptyError: "Auth fail without bearer fss-dev-token.",
    href: "/settings",
    cta: "Open settings",
  },
  {
    id: "guided-demo",
    name: "Guided demo walkthrough",
    actor: "New evaluator",
    job: "Walk the soft-sim path in numbered steps.",
    steps: [
      "/demo — complete steps in order",
      "Acknowledge honesty fence",
      "Run the seeded compare",
    ],
    success: "Demo compare completed with a visible winner and gap.",
    emptyError: "Step blocked until prior demo step is marked done.",
    href: "/demo",
    cta: "Open demo",
  },
];

export default function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Named journeys for feature sufficiency soft-sim — not a desk shell."
    >
      <ul className="space-y-6">
        {NAMED_FLOWS.map((flow) => (
          <li
            key={flow.id}
            className="rounded-lg border border-[var(--studio-line)] bg-[var(--studio-panel)] p-5"
          >
            <h2 className="font-[family-name:var(--font-display)] text-xl text-slate-900">
              {flow.name}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              <span className="font-medium">actor</span>: {flow.actor}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">job</span>: {flow.job}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">success</span>: {flow.success}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              <span className="font-medium">emptyError</span>: {flow.emptyError}
            </p>
            <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-slate-500">
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
