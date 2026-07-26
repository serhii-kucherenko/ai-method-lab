import { scoreHeadcountOnly, scoreUsageAware } from "./domain/scoring";

export const memory = {
  orgs: ["Acme SaaS stack"],
  members: ["owner@studio.local"],
  audits: ["idle seat pack locked"],
};

export function listFeatures() {
  return [
    "org packs",
    "seats",
    "activity",
    "waste",
    "reclaim",
    "forecasts",
    "waste dollar panel",
    "reclaimable panel",
    "idle threshold",
    "headcount baseline",
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
    idleThresholdDays: 14,
    reclaimFriction: 0.2,
    seats: [
      { id: "a", monthlyCost: 45, activeDays: 18, lastLoginDaysAgo: 1 },
      { id: "b", monthlyCost: 45, activeDays: 0, lastLoginDaysAgo: 40 },
      { id: "c", monthlyCost: 30, activeDays: 1, lastLoginDaysAgo: 21 },
    ],
  };
  return { usageAware: scoreUsageAware(input), headcountOnly: scoreHeadcountOnly(input) };
}
