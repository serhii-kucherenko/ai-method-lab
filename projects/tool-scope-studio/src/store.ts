import { scoreOpenTools, scoreScopeBound } from "./domain/scoring";

export const memory = {
  fleets: ["Customer support agents"],
  members: ["owner@studio.local"],
  audits: ["tool scope pack locked"],
};

export function listFeatures() {
  return [
    "fleet packs",
    "agents",
    "scopes",
    "tools",
    "grants",
    "denials",
    "grant rate panel",
    "deny risk panel",
    "sensitive tool flags",
    "declared scope packs",
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
    declaredScopes: ["files", "calendar"],
    openToolsAllowed: true,
    calls: [
      { id: "1", tool: "files.read", inScope: true, sensitive: false },
      { id: "2", tool: "shell.exec", inScope: false, sensitive: true },
      { id: "3", tool: "net.fetch", inScope: false, sensitive: true },
    ],
  };
  return { scopeBound: scoreScopeBound(input), openTools: scoreOpenTools(input) };
}
