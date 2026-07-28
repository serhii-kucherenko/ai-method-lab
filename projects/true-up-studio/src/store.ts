import { scoreSeatRenewal, scoreUsageTrueUp } from "./domain/scoring";

export const memory = {
  vendors: ["Cloud analytics vendor"],
  members: ["owner@studio.local"],
  audits: ["true-up pack locked"],
};

export function listFeatures() {
  return [
    "vendor packs",
    "contracts",
    "meters",
    "trueups",
    "invoices",
    "variances",
    "true-up dollar panel",
    "variance panel",
    "overage rates",
    "seat renewal baseline",
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
    seatCount: 50,
    seatPrice: 20,
    lines: [
      { id: "api", committedUnits: 1000, usedUnits: 1450, unitPrice: 0.4, overageRate: 0.9 },
      { id: "storage", committedUnits: 500, usedUnits: 480, unitPrice: 0.2, overageRate: 0.5 },
    ],
  };
  return { usageTrueUp: scoreUsageTrueUp(input), seatRenewal: scoreSeatRenewal(input) };
}
