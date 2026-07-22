/**
 * Impl A — § 1592(c) statutory maximum by culpability × duty-loss branch.
 */
export type PenaltyInput = {
  culpability?: string;
  duty_loss?: number;
  domestic_value?: number;
  dutiable_value?: number;
  flat_2x_cheat?: boolean;
  dual_approver_cheat?: boolean;
  ignore_domestic_cap?: boolean;
};

export type PenaltyOk = {
  status: "ok";
  penalty_max: number;
  branch: "fraud_domestic" | "lesser_of_duty" | "pct_dutiable";
  algorithm_version: "c1592-v0";
};

export type PenaltyReject = {
  status: "reject";
  reason: string;
};

export type PenaltyResult = PenaltyOk | PenaltyReject;

export function penaltyMax(input: PenaltyInput): PenaltyResult {
  if (input.flat_2x_cheat === true) {
    return { status: "reject", reason: "flat_2x_cheat" };
  }
  if (input.dual_approver_cheat === true) {
    return { status: "reject", reason: "dual_approver_cheat" };
  }
  const culpability = String(input.culpability || "");
  const dutyLoss = Number(input.duty_loss);
  const domestic = Number(input.domestic_value);
  const dutiable = Number(input.dutiable_value);

  if (!["negligence", "gross_negligence", "fraud"].includes(culpability)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  if (!(domestic > 0) || !Number.isFinite(domestic)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  if (!(dutyLoss >= 0) || !Number.isFinite(dutyLoss)) {
    return { status: "reject", reason: "bad_inputs" };
  }

  if (culpability === "fraud") {
    return {
      status: "ok",
      penalty_max: domestic,
      branch: "fraud_domestic",
      algorithm_version: "c1592-v0",
    };
  }

  if (dutyLoss > 0) {
    const multiple = culpability === "gross_negligence" ? 4 : 2;
    const candidate = multiple * dutyLoss;
    if (input.ignore_domestic_cap === true && domestic + 1e-9 < candidate) {
      return { status: "reject", reason: "ignore_domestic_cap" };
    }
    return {
      status: "ok",
      penalty_max: Math.min(domestic, candidate),
      branch: "lesser_of_duty",
      algorithm_version: "c1592-v0",
    };
  }

  if (!(dutiable > 0) || !Number.isFinite(dutiable)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  const pct = culpability === "gross_negligence" ? 0.4 : 0.2;
  return {
    status: "ok",
    penalty_max: pct * dutiable,
    branch: "pct_dutiable",
    algorithm_version: "c1592-v0",
  };
}
