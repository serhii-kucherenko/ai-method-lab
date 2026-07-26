import {
  scoreCalendarWindow,
  scoreInterlockAware,
  type ScoreInput,
} from "./domain/scoring";

export const GOLDENS = Array.from({ length: 30 }, (_, i) => {
  const input: ScoreInput = {
    programRisk: 20 + (i % 70),
    permitSigned: i % 3 !== 0,
    inMaintenanceWindow: i % 2 === 0,
    downloadAttempted: i % 5 !== 0,
    interlocks: [
      { id: `il-a-${i}`, satisfied: i % 4 !== 0, critical: true },
      { id: `il-b-${i}`, satisfied: i % 5 !== 0, critical: true },
      { id: `il-c-${i}`, satisfied: i % 6 !== 0, critical: false },
      { id: `il-d-${i}`, satisfied: i % 7 !== 0, critical: false },
    ],
  };
  return {
    id: `dgs-${String(i + 1).padStart(3, "0")}`,
    input,
    interlockAware: scoreInterlockAware(input),
    calendarWindow: scoreCalendarWindow(input),
  };
});
