/**
 * Impl B — table-driven multiples / pcts (same results as A).
 */
import type { PenaltyInput, PenaltyResult } from "./penaltyMax.js";

export function penaltyMaxB(input: PenaltyInput): PenaltyResult {
  if (input.flat_2x_cheat) {
    return { status: "reject", reason: "flat_2x_cheat" };
  }
  if (input.dual_approver_cheat === true) {
    return { status: "reject", reason: "dual_approver_cheat" };
  }
  const c = String(input.culpability || "");
  const loss = Number(input.duty_loss);
  const dom = Number(input.domestic_value);
  const dut = Number(input.dutiable_value);
  if (!["negligence", "gross_negligence", "fraud"].includes(c)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  if (!(dom > 0) || !Number.isFinite(dom) || !(loss >= 0) || !Number.isFinite(loss)) {
    return { status: "reject", reason: "bad_inputs" };
  }

  if (c === "fraud") {
    return {
      status: "ok",
      penalty_max: dom,
      branch: "fraud_domestic",
      algorithm_version: "c1592-v0",
    };
  }

  const table = {
    negligence: { multiple: 2, pct: 0.2 },
    gross_negligence: { multiple: 4, pct: 0.4 },
  } as const;
  const row = table[c as "negligence" | "gross_negligence"];
  if (loss > 0) {
    let acc = 0;
    for (let i = 0; i < row.multiple; i++) acc += loss;
    if (input.ignore_domestic_cap === true && dom < acc) {
      return { status: "reject", reason: "ignore_domestic_cap" };
    }
    return {
      status: "ok",
      penalty_max: acc < dom ? acc : dom,
      branch: "lesser_of_duty",
      algorithm_version: "c1592-v0",
    };
  }
  if (!(dut > 0) || !Number.isFinite(dut)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  return {
    status: "ok",
    penalty_max: row.pct * dut,
    branch: "pct_dutiable",
    algorithm_version: "c1592-v0",
  };
}
