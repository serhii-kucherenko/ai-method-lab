import { scorePatternRedact, scoreRawExport } from "./domain/scoring";

export const memory = {
  fleets: ["Support agent fleet"],
  members: ["owner@studio.local"],
  audits: ["secret redact pack locked"],
};

export function listFeatures() {
  return [
    "fleet packs",
    "traces",
    "patterns",
    "redactions",
    "exports",
    "leaks",
    "leak count panel",
    "redact coverage panel",
    "pattern library",
    "export gate",
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
    exportRequested: true,
    findings: [
      { id: "1", kind: "api_key" as const, matched: true, redacted: true },
      { id: "2", kind: "token" as const, matched: true, redacted: false },
      { id: "3", kind: "password" as const, matched: true, redacted: true },
    ],
  };
  return { patternRedact: scorePatternRedact(input), rawExport: scoreRawExport(input) };
}
