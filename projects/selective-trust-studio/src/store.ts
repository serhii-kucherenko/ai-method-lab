import { scoreAlwaysStrong, scoreSelective } from "./domain/scoring";

export const memory = {
  policies: ["Support cascade v1"],
  members: ["owner@studio.local"],
  audits: ["policy pack locked"],
};

export function listFeatures() {
  return [
    "policy packs",
    "cascades",
    "search",
    "costs",
    "handoffs",
    "cascade cost panel",
    "escalate rate panel",
    "confidence gate",
    "escalations",
    "compare",
    "scoreboard",
    "bearer auth",
    "members",
    "HMAC webhook",
    "audit",
    "export",
    "pagination",
    "rate limit",
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
    uncertainty: 55,
    steps: [
      { id: "cheap", cost: 1, confidence: 55, strong: false },
      { id: "strong", cost: 8, confidence: 90, strong: true },
    ],
  };
  return { selective: scoreSelective(input), alwaysStrong: scoreAlwaysStrong(input) };
}
