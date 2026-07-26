import { scoreCalendarWindow, scoreInterlockAware } from "./domain/scoring";

export const memory = {
  plants: ["Line 4 packaging cell"],
  members: ["owner@studio.local"],
  audits: ["download gate pack locked"],
};

export function listFeatures() {
  return [
    "plant packs",
    "programs",
    "interlocks",
    "permits",
    "downloads",
    "holds",
    "gate status panel",
    "hold risk panel",
    "critical interlock checks",
    "signed permit gate",
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
    programRisk: 62,
    permitSigned: true,
    inMaintenanceWindow: true,
    downloadAttempted: true,
    interlocks: [
      { id: "e-stop", satisfied: true, critical: true },
      { id: "guard", satisfied: false, critical: true },
      { id: "bypass-log", satisfied: true, critical: false },
    ],
  };
  return {
    interlockAware: scoreInterlockAware(input),
    calendarWindow: scoreCalendarWindow(input),
  };
}
