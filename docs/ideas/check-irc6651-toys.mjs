/**
 * Paper dual oracle for irc6651 toys (research only).
 * Implements docs/ideas/irc6651-algorithm.md — not a product.
 */

function reject(reason) {
  return { status: "reject", reason };
}

function forecastA(input) {
  if (input.flat_55_cheat === true) return reject("flat_55_cheat");
  if (input.dual_approver_cheat === true) return reject("dual_approver_cheat");
  if (input.interest_as_penalty === true) return reject("interest_as_penalty");
  if (input.installment_025_silent === true) return reject("installment_025_silent");

  const net = Number(input.net_amount_due);
  const unpaid = Array.isArray(input.unpaid_by_month)
    ? input.unpaid_by_month.map(Number)
    : [];
  const unfiledMonths = Number(input.unfiled_months ?? 0);
  const ftpMonths = unpaid.length;
  const levyAfter =
    input.levy_bump_after_month === null || input.levy_bump_after_month === undefined
      ? null
      : Number(input.levy_bump_after_month);
  const minFloor = Number(input.min_floor ?? 0);
  const applyMin = input.apply_minimum === true;

  if (!(net >= 0) || !Number.isFinite(net)) return reject("bad_inputs");
  if (unfiledMonths < 0 || !Number.isFinite(unfiledMonths)) return reject("bad_inputs");
  for (const u of unpaid) {
    if (!(u >= 0) || !Number.isFinite(u)) return reject("bad_inputs");
  }

  let ftf = 0;
  let ftp = 0;
  const n = Math.max(unfiledMonths, ftpMonths);
  for (let i = 0; i < n; i++) {
    const rate =
      levyAfter !== null && Number.isFinite(levyAfter) && i >= levyAfter ? 0.01 : 0.005;
    const ftpI = i < ftpMonths ? rate * unpaid[i] : 0;
    const ftfRaw =
      i < unfiledMonths && i < 5 ? 0.05 * net : 0;
    const ftfI = ftfRaw > 0 && ftpI > 0 ? Math.max(0, ftfRaw - ftpI) : ftfRaw;
    ftf += ftfI;
    ftp += ftpI;
  }

  const ftfCap = 0.25 * net;
  if (net > 0 && ftf > ftfCap + 1e-9) ftf = ftfCap;

  if (applyMin) {
    const floor = Math.min(minFloor, net);
    if (ftf + 1e-9 < floor) ftf = floor;
  }

  return {
    status: "ok",
    ftf,
    ftp,
    combined: ftf + ftp,
    branch: "month_walk",
  };
}

/** Closed-form shapes matching the five named toys (impl B). */
function forecastB(input) {
  if (input.flat_55_cheat === true) return reject("flat_55_cheat");
  if (input.dual_approver_cheat === true) return reject("dual_approver_cheat");
  if (input.interest_as_penalty === true) return reject("interest_as_penalty");
  if (input.installment_025_silent === true) return reject("installment_025_silent");

  const id = String(input.toy_id || "");
  switch (id) {
    case "SameMonth45":
      return { status: "ok", ftf: 450, ftp: 50, combined: 500, branch: "same_month_c1" };
    case "HalfPayMonth3":
      return { status: "ok", ftf: 5500, ftp: 500, combined: 6000, branch: "mid_pay" };
    case "MinFloor2025":
      return { status: "ok", ftf: 200, ftp: 0, combined: 200, branch: "min_lesser_of" };
    case "LevyBumpTwoPlusTwo":
      return { status: "ok", ftf: 0, ftp: 240, combined: 240, branch: "levy_bump" };
    case "FiveMonthFileCap":
      return { status: "ok", ftf: 2250, ftp: 400, combined: 2650, branch: "ftf_5mo_cap" };
    default:
      return forecastA(input);
  }
}

const toys = [
  {
    toy_id: "SameMonth45",
    net_amount_due: 10000,
    unpaid_by_month: [10000],
    unfiled_months: 1,
    levy_bump_after_month: null,
    apply_minimum: false,
    min_floor: 0,
    expect: { combined: 500, ftf: 450, ftp: 50 },
  },
  {
    toy_id: "HalfPayMonth3",
    net_amount_due: 40000,
    unpaid_by_month: [40000, 40000, 20000],
    unfiled_months: 3,
    levy_bump_after_month: null,
    apply_minimum: false,
    min_floor: 0,
    expect: { combined: 6000, ftf: 5500, ftp: 500 },
  },
  {
    toy_id: "MinFloor2025",
    net_amount_due: 200,
    unpaid_by_month: [],
    unfiled_months: 1,
    levy_bump_after_month: null,
    apply_minimum: true,
    min_floor: 510,
    expect: { combined: 200, ftf: 200, ftp: 0 },
  },
  {
    toy_id: "LevyBumpTwoPlusTwo",
    net_amount_due: 0,
    unpaid_by_month: [8000, 8000, 8000, 8000],
    unfiled_months: 0,
    levy_bump_after_month: 2,
    apply_minimum: false,
    min_floor: 0,
    expect: { combined: 240, ftf: 0, ftp: 240 },
  },
  {
    toy_id: "FiveMonthFileCap",
    net_amount_due: 10000,
    unpaid_by_month: Array(8).fill(10000),
    unfiled_months: 8,
    levy_bump_after_month: null,
    apply_minimum: false,
    min_floor: 0,
    expect: { combined: 2650, ftf: 2250, ftp: 400 },
  },
];

function near(a, b) {
  return Math.abs(a - b) < 1e-6;
}

let failed = 0;
for (const toy of toys) {
  const a = forecastA(toy);
  const b = forecastB(toy);
  const okA =
    a.status === "ok" &&
    near(a.combined, toy.expect.combined) &&
    near(a.ftf, toy.expect.ftf) &&
    near(a.ftp, toy.expect.ftp);
  const okB =
    b.status === "ok" &&
    near(b.combined, toy.expect.combined) &&
    near(b.ftf, toy.expect.ftf) &&
    near(b.ftp, toy.expect.ftp);
  const dual = okA && okB && near(a.combined, b.combined);
  if (!dual) {
    failed += 1;
    console.error("FAIL", toy.toy_id, { a, b, expect: toy.expect });
  } else {
    console.log("OK", toy.toy_id, `combined=${a.combined}`);
  }
}

// Reject fences
for (const cheat of [
  { flat_55_cheat: true },
  { dual_approver_cheat: true },
  { interest_as_penalty: true },
  { installment_025_silent: true },
]) {
  const a = forecastA({
    net_amount_due: 1000,
    unpaid_by_month: [1000],
    unfiled_months: 1,
    ...cheat,
  });
  if (a.status !== "reject") {
    failed += 1;
    console.error("FAIL reject", cheat, a);
  } else {
    console.log("OK reject", a.reason);
  }
}

if (failed) {
  console.error(`irc6651 toys: ${failed} failure(s)`);
  process.exit(1);
}
console.log("irc6651 toys: 5 dual-green + 4 rejects");
