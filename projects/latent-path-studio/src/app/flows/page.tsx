import Link from "next/link";
import { StudioShell } from "@/components/studio-shell";

const NAMED_FLOWS = [
  {
    id: "create-cohort-pack",
    name: "Create cohort pack",
    actor: "Analytics lead",
    job: "Version a soft-sim cohort pack before predictors enroll waves.",
    steps: ["/packs", "/cohorts", "/predictors"],
    success: "Active pack with study focus and session budget.",
    emptyError: "Create fails without label/version/study focus.",
    href: "/packs",
  },
  {
    id: "configure-predictors",
    name: "Configure predictors",
    actor: "Screening product eng",
    job: "Register joint predictor sets spanning symptom domains.",
    steps: ["/predictors", "/packs", "/trajectories"],
    success: "Active predictor linked to a pack with feature count.",
    emptyError: "Predictor create fails when pack id is missing.",
    href: "/predictors",
  },
  {
    id: "configure-trajectories",
    name: "Configure trajectory classes",
    actor: "Latent class analyst",
    job: "Lock trajectory recipes for multi-domain latent paths.",
    steps: ["/trajectories", "/outcomes", "/cohorts"],
    success: "Active trajectory with coverage and separation scores.",
    emptyError: "Trajectory create fails without outcome/cohort/predictor refs.",
    href: "/trajectories",
  },
  {
    id: "run-ab-compare",
    name: "Run A/B compare",
    actor: "MH analytics eng",
    job: "Compare multi-domain latent trajectory vs single-domain baseline.",
    steps: ["/outcomes", "/trajectories", "/compare", "/scoreboard"],
    success: "Compare row with winner, gap, and dual scores.",
    emptyError: "Compare fails when outcome/cohort/predictor/trajectory ids mismatch.",
    href: "/compare",
  },
  {
    id: "export-webhook",
    name: "Export + webhook",
    actor: "Org owner",
    job: "Export pack JSON/CSV and verify HMAC webhook ingest.",
    steps: ["/settings", "/scoreboard", "/honesty"],
    success: "Export payload downloaded; webhook ack with idempotency.",
    emptyError: "Webhook rejects bad HMAC signature.",
    href: "/settings",
  },
] as const;

export function FlowsPage() {
  return (
    <StudioShell
      title="User flows"
      subtitle="Five sophisticated journeys for multi-domain latent adolescent path soft-sim — not a single happy path."
    >
      <div className="space-y-5">
        {NAMED_FLOWS.map((flow) => (
          <article
            key={flow.id}
            className="row-lift rounded-lg border bg-white p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-xl">
                  {flow.name}
                </h2>
                <p className="mt-1 text-sm">
                  <span className="font-medium">Actor:</span> {flow.actor}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Job:</span> {flow.job}
                </p>
                <p className="mt-2 text-sm text-[color-mix(in_srgb,var(--studio-ink)_65%,transparent)]">
                  Steps: {flow.steps.join(" → ")}
                </p>
                <p className="text-sm text-[var(--lp-teal)]">
                  Success: {flow.success}
                </p>
                <p className="text-sm text-[var(--lp-amber)]">
                  Empty/error: {flow.emptyError}
                </p>
              </div>
              <Link
                href={flow.href}
                className="rounded-md bg-[var(--lp-teal)] px-3 py-2 text-sm text-white"
              >
                Enter flow
              </Link>
            </div>
          </article>
        ))}
      </div>
    </StudioShell>
  );
}

export default FlowsPage;
