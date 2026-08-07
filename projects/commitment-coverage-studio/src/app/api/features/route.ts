import { NextResponse } from "next/server";

const FEATURES = [
  "dual-scorers-commit-matched",
  "dual-scorers-ondemand-blind",
  "goldens-catalog",
  "sqlite-coverage-db",
  "goldens-sample-api",
  "features-inventory-api",
  "soft-sim-honesty",
  "marketing-landing",
  "renewal-cases",
  "renewal-recommendations",
  "pricing",
  "demo-guided",
  "onboarding-checklist",
  "flows-index",
  "org-settings",
  "members",
  "audit",
] as const;

/**
 * Feature inventory of capabilities that are real in this soft-sim lab.
 * Includes Phase 4 commercial + org/members/audit baselines once shipped.
 */
export async function GET() {
  return NextResponse.json({
    softSim: true,
    note: "Soft-sim lab desk — not a live billing system of record",
    features: [...FEATURES],
  });
}
