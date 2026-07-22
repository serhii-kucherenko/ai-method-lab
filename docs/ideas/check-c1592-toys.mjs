/**
 * Paper oracle for c1592 (research — framed idea).
 * Implements docs/ideas/c1592-algorithm.md
 */
function penaltyMax(input) {
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

const toys = [
  {
    id: "A",
    input: {
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 500000,
      dutiable_value: 500000,
    },
    expect: { status: "ok", penalty_max: 200000, branch: "lesser_of_duty" },
  },
  {
    id: "B",
    input: {
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 150000,
      dutiable_value: 150000,
    },
    expect: { status: "ok", penalty_max: 150000, branch: "lesser_of_duty" },
  },
  {
    id: "C",
    input: {
      culpability: "negligence",
      duty_loss: 0,
      domestic_value: 100000,
      dutiable_value: 100000,
    },
    expect: { status: "ok", penalty_max: 20000, branch: "pct_dutiable" },
  },
  {
    id: "D",
    input: {
      culpability: "gross_negligence",
      duty_loss: 0,
      domestic_value: 100000,
      dutiable_value: 100000,
    },
    expect: { status: "ok", penalty_max: 40000, branch: "pct_dutiable" },
  },
  {
    id: "E",
    input: {
      culpability: "fraud",
      duty_loss: 50000,
      domestic_value: 80000,
      dutiable_value: 80000,
    },
    expect: { status: "ok", penalty_max: 80000, branch: "fraud_domestic" },
  },
  {
    id: "F",
    input: {
      culpability: "negligence",
      duty_loss: 100000,
      domestic_value: 500000,
      dutiable_value: 500000,
      flat_2x_cheat: true,
    },
    expect: { status: "reject", reason: "flat_2x_cheat" },
  },
];

let failed = 0;
for (const toy of toys) {
  const got = penaltyMax(toy.input);
  const want = toy.expect;
  let ok = got.status === want.status;
  if (ok && want.status === "ok") {
    ok =
      Math.abs(got.penalty_max - want.penalty_max) <= 0.02 &&
      got.branch === want.branch;
  }
  if (ok && want.reason) ok = got.reason === want.reason;
  if (!ok) {
    failed += 1;
    console.error("FAIL", toy.id, { got, want });
  }
}

if (failed) {
  console.error(`c1592 paper toys: ${failed} failed`);
  process.exit(1);
}
console.log(`c1592 paper toys: ${toys.length} ok`);
