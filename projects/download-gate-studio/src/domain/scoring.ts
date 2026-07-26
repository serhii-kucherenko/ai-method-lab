export type Check = {
  id: string;
  satisfied: boolean;
  critical: boolean;
};

export type ScoreInput = {
  programRisk: number; // 0-100
  permitSigned: boolean;
  inMaintenanceWindow: boolean;
  interlocks: Check[];
  downloadAttempted: boolean;
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  gateOpen: boolean;
  holdRisk: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;

/** Interlock-aware: require signed permit + critical interlocks before download. */
export function scoreInterlockAware(input: ScoreInput): ScoreOutput {
  const criticalFail = input.interlocks.filter((c) => c.critical && !c.satisfied).length;
  const softFail = input.interlocks.filter((c) => !c.critical && !c.satisfied).length;
  const gateOpen =
    input.permitSigned &&
    criticalFail === 0 &&
    (input.inMaintenanceWindow || input.programRisk < 40) &&
    softFail <= 1;
  const holdRisk = clamp(
    criticalFail * 28 + softFail * 10 + (input.permitSigned ? 0 : 35) + input.programRisk * 0.25,
  );
  return {
    score: clamp(gateOpen ? 78 + (10 - softFail * 3) : 35 + (input.permitSigned ? 12 : 0)),
    trust: clamp(gateOpen ? 82 - softFail * 4 : 45 - criticalFail * 5),
    escalated: !gateOpen && input.downloadAttempted,
    gateOpen,
    holdRisk,
    rationale: `Interlock-aware criticalFail=${criticalFail} softFail=${softFail} permit=${input.permitSigned} gateOpen=${gateOpen}`,
  };
}

/** Calendar-window-only: open gate whenever maintenance window is active. */
export function scoreCalendarWindow(input: ScoreInput): ScoreOutput {
  const gateOpen = input.inMaintenanceWindow;
  return {
    score: clamp(gateOpen ? 70 : 40),
    trust: 55,
    escalated: !gateOpen && input.downloadAttempted,
    gateOpen,
    holdRisk: clamp(gateOpen ? 25 + input.programRisk * 0.2 : 60 + input.programRisk * 0.3),
    rationale: gateOpen
      ? "Calendar-window-only opens gate during maintenance without interlock proof"
      : "Calendar-window-only: outside maintenance window",
  };
}
