/**
 * Impl B — independent rewrite of the month-walk (different loop shape / caps).
 * Must agree with forecast.ts on every golden.
 */
import type { ForecastInput, ForecastResult } from "./forecast.js";

function reject(reason: string): ForecastResult {
  return { status: "reject", reason };
}

export function forecastB(input: ForecastInput): ForecastResult {
  const cheats: Array<[keyof ForecastInput, string]> = [
    ["flat_55_cheat", "flat_55_cheat"],
    ["dual_approver_cheat", "dual_approver_cheat"],
    ["interest_as_penalty", "interest_as_penalty"],
    ["installment_025_silent", "installment_025_silent"],
    ["partnership_6698_cheat", "partnership_6698_cheat"],
    ["scorp_6699_cheat", "scorp_6699_cheat"],
    ["c1_after_ftf_cap_cheat", "c1_after_ftf_cap_cheat"],
    ["min_undercut_cheat", "min_undercut_cheat"],
  ];
  for (const [flag, reason] of cheats) {
    if (input[flag] === true) return reject(reason);
  }

  const taxDue = Number(input.net_amount_due);
  if (!Number.isFinite(taxDue) || taxDue < 0) return reject("bad_inputs");

  const unpaidMonths = Array.isArray(input.unpaid_by_month)
    ? [...input.unpaid_by_month].map(Number)
    : [];
  for (const balance of unpaidMonths) {
    if (!Number.isFinite(balance) || balance < 0) return reject("bad_inputs");
  }

  const lateFileMonths = Number(input.unfiled_months ?? 0);
  if (!Number.isFinite(lateFileMonths) || lateFileMonths < 0) return reject("bad_inputs");

  const bumpFrom =
    input.levy_bump_after_month == null ? Number.POSITIVE_INFINITY : Number(input.levy_bump_after_month);

  const fileAccrualMonths = Math.min(Math.max(0, Math.floor(lateFileMonths)), 5);
  const payAccrualMonths = unpaidMonths.length;
  const horizon = Math.max(fileAccrualMonths, payAccrualMonths, lateFileMonths);

  let failureToFile = 0;
  let failureToPay = 0;

  let month = 0;
  while (month < horizon) {
    const ftpRate = month >= bumpFrom ? 0.01 : 0.005;
    const paySlice =
      month < payAccrualMonths ? unpaidMonths[month]! * ftpRate : 0;
    const fileEligible = month < lateFileMonths && month < 5;
    const fileSliceRaw = fileEligible ? taxDue * 0.05 : 0;
    const fileSlice =
      fileSliceRaw > 0 && paySlice > 0
        ? Math.max(0, fileSliceRaw - paySlice)
        : fileSliceRaw;
    failureToFile += fileSlice;
    failureToPay += paySlice;
    month += 1;
  }

  const ftfCap = taxDue * 0.25;
  if (taxDue > 0 && failureToFile > ftfCap + 1e-9) {
    failureToFile = ftfCap;
  }

  const peakUnpaid = unpaidMonths.length
    ? unpaidMonths.reduce((a, b) => (a > b ? a : b), 0)
    : taxDue;
  const ftpCap = peakUnpaid * 0.25;
  if (peakUnpaid > 0 && failureToPay > ftpCap + 1e-9) {
    failureToPay = ftpCap;
  }

  if (input.apply_minimum === true) {
    const floorAmt = Math.min(Number(input.min_floor ?? 0), taxDue);
    if (failureToFile + 1e-9 < floorAmt) failureToFile = floorAmt;
  }

  return {
    status: "ok",
    ftf: failureToFile,
    ftp: failureToPay,
    combined: failureToFile + failureToPay,
    branch: "month_walk",
    algorithm_version: "fpd-v0",
  };
}
