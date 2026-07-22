/**
 * Impl B — independent rewrite of the same true-up (check-depositgap-dual.mjs trueUpB).
 * Must agree with forecast.ts on every golden.
 */
import type { ForecastInput, ForecastResult } from "./forecast.js";

export function trueUpB(input: ForecastInput): ForecastResult {
  const value = Number(input.entered_value);
  const dep = input.deposit_rate;
  const ass = input.assessed_rate;
  const rate = input.interest_annual_rate;
  if (
    !(value > 0) ||
    typeof dep !== "number" ||
    typeof ass !== "number" ||
    typeof rate !== "number" ||
    !(dep >= 0) ||
    !(ass >= 0) ||
    !Number.isFinite(rate) ||
    rate < 0
  ) {
    return { status: "reject", reason: "invalid_input" };
  }

  const t0 = Date.parse(`${input.order_published_on}T00:00:00.000Z`);
  const t1 = Date.parse(`${input.liquidated_on}T00:00:00.000Z`);
  if (!Number.isFinite(t0) || !Number.isFinite(t1) || t1 < t0) {
    return { status: "reject", reason: "invalid_window" };
  }

  const dayCount = Math.round((t1 - t0) / (24 * 60 * 60 * 1000));
  if (input.skip_interest === true && dayCount > 0) {
    return { status: "reject", reason: "skip_interest_forbidden" };
  }

  const delta = value * (ass - dep);
  const yearFraction = dayCount / 365;
  const intAmt = delta * rate * yearFraction;

  return {
    status: "ok",
    duty_delta: delta,
    days: dayCount,
    interest: intAmt,
    true_up: delta + intAmt,
    algorithm_version: "depositgap-v0",
  };
}
