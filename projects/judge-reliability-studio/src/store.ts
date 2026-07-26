import { scoreAgreement, scoreIrt } from "./domain/scoring";

export const memory = {
  judges: ["Support judge v1"],
  members: ["owner@studio.local"],
  audits: ["judge pack locked"],
};

export function listFeatures() {
  return [
    "judge packs",
    "items",
    "search",
    "diagnostics",
    "forms",
    "ability panel",
    "difficulty panel",
    "discrimination panel",
    "flags",
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
    formFit: 68,
    items: [{ id: "a", weight: 1, responses: ["source"], expected: "x" }],
  };
  return { irt: scoreIrt(input), agreement: scoreAgreement(input) };
}
