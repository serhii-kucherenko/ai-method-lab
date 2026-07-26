import { scoreCalendarOnly, scoreCreditAware } from "./domain/scoring";

export const memory = {
  contracts: ["Enterprise SLA — Gold"],
  members: ["owner@studio.local"],
  audits: ["credit forecast pack locked"],
};

export function listFeatures() {
  return [
    "contract packs",
    "incidents",
    "credits",
    "windows",
    "exclusions",
    "forecasts",
    "credit dollar panel",
    "breach risk panel",
    "compound incidents",
    "credit caps",
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
    monthlyFee: 5000,
    creditPerMinute: 2.5,
    creditCapPct: 30,
    compoundFactor: 1.15,
    incidents: [
      { id: "a", downtimeMinutes: 45, excluded: false, severity: 0.8 },
      { id: "b", downtimeMinutes: 20, excluded: true, severity: 0.5 },
      { id: "c", downtimeMinutes: 15, excluded: false, severity: 0.6 },
    ],
  };
  return { creditAware: scoreCreditAware(input), calendarOnly: scoreCalendarOnly(input) };
}
