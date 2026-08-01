import { scoreHardCap, scoreSoftWarn } from "./domain/scoring";

export const memory = {
  accounts: ["platform-prod"],
  members: ["owner@studio.local"],
  audits: ["spend cap pack locked"],
};

export function listFeatures() {
  return [
    "account packs",
    "caps",
    "meters",
    "charges",
    "breaches",
    "overrides",
    "block rate panel",
    "breach panel",
    "override grants",
    "cap calendar",
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
    capUsd: 1000,
    spentUsd: 920,
    charges: [
      { id: "a", amountUsd: 120, wouldExceed: true, overrideApproved: false },
      { id: "b", amountUsd: 40, wouldExceed: true, overrideApproved: true },
      { id: "c", amountUsd: 25, wouldExceed: false, overrideApproved: false },
    ],
  };
  return { hardCap: scoreHardCap(input), softWarn: scoreSoftWarn(input) };
}
