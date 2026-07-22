/** Shared paper oracle A for c1592 (import-safe). */
export function penaltyMax(input) {
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
    return { status: "ok", penalty_max: domestic, branch: "fraud_domestic" };
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
  };
}

export function penaltyMaxB(input) {
  if (input.flat_2x_cheat) return { status: "reject", reason: "flat_2x_cheat" };
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
    return { status: "ok", penalty_max: dom, branch: "fraud_domestic" };
  }

  const table = {
    negligence: { multiple: 2, pct: 0.2 },
    gross_negligence: { multiple: 4, pct: 0.4 },
  };
  const row = table[c];
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
    };
  }
  if (!(dut > 0) || !Number.isFinite(dut)) {
    return { status: "reject", reason: "bad_inputs" };
  }
  return {
    status: "ok",
    penalty_max: row.pct * dut,
    branch: "pct_dutiable",
  };
}
