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
  "renewals",
  "renewal-recommendations",
  "pricing",
  "demo-guided",
  "onboarding-checklist",
  "flows-index",
  "org-settings",
  "members",
  "audit",
  "webhook-hmac",
  "export-json-csv",
  "rate-limit",
  "imports",
  "commitments",
  "coverage",
  "gaps",
  "compare",
  "scoreboard",
  "accounts-api",
  "settings-shell",
  "bearer-auth",
] as const;

/**
 * Feature inventory of capabilities that are real in this soft-sim lab.
 * Locked shipped-surface IDs map to user-visible pages (D-01 / SUS-01).
 */
export async function GET() {
  return NextResponse.json({
    softSim: true,
    note: "Soft-sim lab desk — not a live billing system of record",
    features: [...FEATURES],
  });
}
