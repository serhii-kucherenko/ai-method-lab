/**
 * Impl A — mirrors docs/ideas/depositgap-algorithm.md (check-depositgap-fixtures.mjs).
 * Forecast only: deposit → assessed duty delta + § 1677g-shaped simple interest toy.
 */
export type ForecastInput = {
  order_type?: string;
  deposit_rate: number | null | undefined;
  assessed_rate: number | null | undefined;
  rate_class?: string;
  entered_value: number;
  order_published_on: string;
  liquidated_on: string;
  interest_annual_rate: number | null | undefined;
  skip_interest?: boolean;
};

export type ForecastOk = {
  status: "ok";
  duty_delta: number;
  days: number;
  interest: number;
  true_up: number;
  algorithm_version: "depositgap-v0";
};

export type ForecastReject = {
  status: "reject";
  reason?: string;
};

export type ForecastResult = ForecastOk | ForecastReject;

function daysExclusiveStartInclusiveEnd(startIso: string, endIso: string): number | null {
  const start = Date.parse(`${startIso}T00:00:00Z`);
  const end = Date.parse(`${endIso}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return null;
  }
  return Math.round((end - start) / 86400000);
}

export function trueUp(input: ForecastInput): ForecastResult {
  if (
    !(input.entered_value > 0) ||
    typeof input.deposit_rate !== "number" ||
    typeof input.assessed_rate !== "number" ||
    typeof input.interest_annual_rate !== "number" ||
    input.deposit_rate < 0 ||
    input.assessed_rate < 0 ||
    !Number.isFinite(input.interest_annual_rate) ||
    input.interest_annual_rate < 0
  ) {
    return { status: "reject", reason: "invalid_input" };
  }

  const days = daysExclusiveStartInclusiveEnd(
    input.order_published_on,
    input.liquidated_on,
  );
  if (days === null || days < 0) {
    return { status: "reject", reason: "invalid_window" };
  }

  // Honesty: never skip the interest window when dates differ
  if (input.skip_interest === true && days > 0) {
    return { status: "reject", reason: "skip_interest_forbidden" };
  }

  const duty_delta =
    (input.assessed_rate - input.deposit_rate) * input.entered_value;
  const interest = duty_delta * input.interest_annual_rate * (days / 365);
  const true_up = duty_delta + interest;

  return {
    status: "ok",
    duty_delta,
    days,
    interest,
    true_up,
    algorithm_version: "depositgap-v0",
  };
}
