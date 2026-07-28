export type MeterLine = {
  id: string;
  committedUnits: number;
  usedUnits: number;
  unitPrice: number;
  overageRate: number;
};

export type ScoreInput = {
  lines: MeterLine[];
  seatCount: number;
  seatPrice: number;
};

export type ScoreOutput = {
  score: number;
  trust: number;
  escalated: boolean;
  trueUpDollars: number;
  varianceDollars: number;
  rationale: string;
};

const clamp = (n: number) => Math.round(Math.max(0, Math.min(100, n)) * 100) / 100;
const money = (n: number) => Math.round(n * 100) / 100;

/** Usage true-up: price overage from meters. */
export function scoreUsageTrueUp(input: ScoreInput): ScoreOutput {
  let trueUp = 0;
  let committed = 0;
  for (const line of input.lines) {
    committed += line.committedUnits * line.unitPrice;
    const over = Math.max(0, line.usedUnits - line.committedUnits);
    trueUp += over * line.overageRate;
  }
  const seatBill = input.seatCount * input.seatPrice;
  const variance = trueUp + committed - seatBill;
  return {
    score: clamp(88 - (trueUp / Math.max(1, seatBill)) * 40),
    trust: clamp(78 - (trueUp / Math.max(1, seatBill)) * 20),
    escalated: trueUp > seatBill * 0.15,
    trueUpDollars: money(trueUp),
    varianceDollars: money(variance),
    rationale: `Usage true-up overage=$${money(trueUp)} variance=$${money(variance)}`,
  };
}

/** Seat renewal: bill seats only; ignore meters. */
export function scoreSeatRenewal(input: ScoreInput): ScoreOutput {
  const seatBill = input.seatCount * input.seatPrice;
  return {
    score: 70,
    trust: 48,
    escalated: false,
    trueUpDollars: 0,
    varianceDollars: money(-seatBill * 0.05),
    rationale: `Seat-renewal bills $${money(seatBill)}; meters ignored`,
  };
}
