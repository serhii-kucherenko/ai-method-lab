/** FAR 117 Table B (unaugmented) + §117.25(e)/(b) v0 legality. */

const TABLE: Array<{ start: number; end: number; cols: number[] }> = [
  { start: 0, end: 359, cols: [9, 9, 9, 9, 9, 9, 9] },
  { start: 400, end: 459, cols: [10, 10, 10, 10, 9, 9, 9] },
  { start: 500, end: 559, cols: [12, 12, 12, 12, 11.5, 11, 10.5] },
  { start: 600, end: 659, cols: [13, 13, 12, 12, 11.5, 11, 10.5] },
  { start: 700, end: 1159, cols: [14, 14, 13, 13, 12.5, 12, 11.5] },
  { start: 1200, end: 1259, cols: [13, 13, 13, 13, 12.5, 12, 11.5] },
  { start: 1300, end: 1659, cols: [12, 12, 12, 12, 11.5, 11, 10.5] },
  { start: 1700, end: 2159, cols: [12, 12, 11, 11, 10, 9, 9] },
  { start: 2200, end: 2259, cols: [11, 11, 10, 10, 9, 9, 9] },
  { start: 2300, end: 2359, cols: [10, 10, 10, 9, 9, 9, 9] },
];

export type PairingInput = {
  report_local: string;
  segments: number;
  acclimated: boolean;
  fdp_hours: number;
  rest_hours?: number;
  max_consecutive_off_in_168h?: number;
  claims_augmented?: boolean;
  has_rest_facility?: boolean;
  pic_extension_hours?: number;
  pic_consent?: boolean;
  deadhead_segments?: number;
  flight_segments?: number;
};

export type LegalityResult = {
  legal: boolean;
  max_fdp: number;
  rest_ok: boolean;
  rolling_30h_ok: boolean;
  reasons: string[];
};

function hoursToMinutes(h: number): number {
  return Math.round(h * 60);
}

export function maxFdpHours(
  reportLocal: string,
  segments: number,
  acclimated: boolean,
): number {
  const hhmm = Number(reportLocal);
  const row = TABLE.find((r) => hhmm >= r.start && hhmm <= r.end);
  if (!row) throw new Error(`no Table B row for ${reportLocal}`);
  const col = Math.min(Math.max(segments, 1), 7) - 1;
  let max = row.cols[col]!;
  if (!acclimated) max -= 0.5;
  return max;
}

export function evaluatePairing(input: PairingInput): LegalityResult {
  const reasons: string[] = [];
  if (input.claims_augmented && !input.has_rest_facility) {
    reasons.push("reject_augmented_claim");
  }
  if (input.pic_extension_hours && !input.pic_consent) {
    reasons.push("reject_extension_without_consent");
  }
  if (
    input.flight_segments !== undefined &&
    input.deadhead_segments !== undefined &&
    input.segments !== input.flight_segments
  ) {
    reasons.push("reject_deadhead_as_segment");
  }

  const max_fdp = maxFdpHours(input.report_local, input.segments, input.acclimated);
  const fdpOk = hoursToMinutes(input.fdp_hours) <= hoursToMinutes(max_fdp);
  if (!fdpOk) reasons.push("fdp_over_table_b");

  const rest_ok =
    input.rest_hours === undefined ? true : input.rest_hours >= 10;
  if (!rest_ok) reasons.push("rest_under_10h");

  const rolling_30h_ok =
    input.max_consecutive_off_in_168h === undefined
      ? true
      : input.max_consecutive_off_in_168h >= 30;
  if (!rolling_30h_ok) reasons.push("missing_30h_in_168");

  const legal =
    fdpOk &&
    rest_ok &&
    rolling_30h_ok &&
    !reasons.includes("reject_augmented_claim") &&
    !reasons.includes("reject_extension_without_consent") &&
    !reasons.includes("reject_deadhead_as_segment");

  return { legal, max_fdp, rest_ok, rolling_30h_ok, reasons };
}
