import { scoreExpiryAware, scorePermanentOpen } from "./domain/scoring";

export const memory = {
  sites: ["Boiler house line 2"],
  members: ["owner@studio.local"],
  audits: ["bypass audit pack locked"],
};

export function listFeatures() {
  return [
    "site packs",
    "bypasses",
    "expiries",
    "restorals",
    "alerts",
    "ledgers",
    "overdue panel",
    "exposure hours panel",
    "grace windows",
    "critical bypass flags",
    "compare",
    "scoreboard",
    "bearer auth",
    "members",
    "HMAC webhook",
    "audit",
    "export",
    "pagination",
    "rate limit",
    "search",
    "pricing",
    "demo",
    "onboarding",
    "flows",
    "honesty",
    "goldens",
    "offline demo",
    "guide",
    "settings",
  ];
}

export function demoScore() {
  const input = {
    graceHours: 2,
    bypasses: [
      { id: "a", hoursOpen: 18, maxHours: 8, restored: false, critical: true },
      { id: "b", hoursOpen: 3, maxHours: 8, restored: false, critical: false },
      { id: "c", hoursOpen: 40, maxHours: 12, restored: true, critical: false },
    ],
  };
  return { expiryAware: scoreExpiryAware(input), permanentOpen: scorePermanentOpen(input) };
}
