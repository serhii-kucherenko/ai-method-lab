import { scoreAlwaysAllow, scoreFreezeAware } from "./domain/scoring";

export const memory = {
  plants: ["Packaging line 3"],
  members: ["owner@studio.local"],
  audits: ["change freeze pack locked"],
};

export function listFeatures() {
  return [
    "plant packs",
    "freezes",
    "windows",
    "requests",
    "violations",
    "approvals",
    "hold rate panel",
    "violation panel",
    "exception grants",
    "freeze calendar",
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
    freezeActive: true,
    requests: [
      { id: "a", duringFreeze: true, approvedException: false, risk: 72 },
      { id: "b", duringFreeze: true, approvedException: true, risk: 40 },
      { id: "c", duringFreeze: false, approvedException: false, risk: 20 },
    ],
  };
  return { freezeAware: scoreFreezeAware(input), alwaysAllow: scoreAlwaysAllow(input) };
}
