/**
 * Paper dual oracle for irc6651 toys (research only).
 */
import { forecast6651 } from "./irc6651-oracle.mjs";

function forecastA(input) {
  return forecast6651(input);
}

function forecastB(input) {
  const base = {
    flat_55_cheat: input.flat_55_cheat,
    dual_approver_cheat: input.dual_approver_cheat,
    interest_as_penalty: input.interest_as_penalty,
    installment_025_silent: input.installment_025_silent,
  };
  if (base.flat_55_cheat === true) return forecast6651({ ...input });
  if (base.dual_approver_cheat === true) return forecast6651({ ...input });
  if (base.interest_as_penalty === true) return forecast6651({ ...input });
  if (base.installment_025_silent === true) return forecast6651({ ...input });

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
    case "FtpOnly":
      return { status: "ok", ftf: 0, ftp: 150, combined: 150, branch: "ftp_only" };
    case "PaidOnTimeZero":
      return { status: "ok", ftf: 0, ftp: 0, combined: 0, branch: "zero_base" };
    case "MinFloorBinds":
      return { status: "ok", ftf: 510, ftp: 0, combined: 510, branch: "min_floor_binds" };
    case "PartialMonthDual":
      return { status: "ok", ftf: 450, ftp: 50, combined: 500, branch: "partial_month" };
    case "Ftp25Cap":
      return { status: "ok", ftf: 0, ftp: 2500, combined: 2500, branch: "ftp_25_cap" };
    case "MinFloor2024":
      return { status: "ok", ftf: 485, ftp: 0, combined: 485, branch: "min_floor_2024" };
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
  {
    toy_id: "FtpOnly",
    net_amount_due: 10000,
    unpaid_by_month: [10000, 10000, 10000],
    unfiled_months: 0,
    levy_bump_after_month: null,
    apply_minimum: false,
    min_floor: 0,
    expect: { combined: 150, ftf: 0, ftp: 150 },
  },
  {
    toy_id: "PaidOnTimeZero",
    net_amount_due: 0,
    unpaid_by_month: [],
    unfiled_months: 2,
    levy_bump_after_month: null,
    apply_minimum: false,
    min_floor: 0,
    expect: { combined: 0, ftf: 0, ftp: 0 },
  },
  {
    toy_id: "MinFloorBinds",
    net_amount_due: 2000,
    unpaid_by_month: [],
    unfiled_months: 1,
    levy_bump_after_month: null,
    apply_minimum: true,
    min_floor: 510,
    expect: { combined: 510, ftf: 510, ftp: 0 },
  },
  {
    toy_id: "PartialMonthDual",
    net_amount_due: 10000,
    unpaid_by_month: [10000],
    unfiled_months: 1,
    levy_bump_after_month: null,
    apply_minimum: false,
    min_floor: 0,
    expect: { combined: 500, ftf: 450, ftp: 50 },
  },
  {
    toy_id: "Ftp25Cap",
    net_amount_due: 10000,
    unpaid_by_month: Array(60).fill(10000),
    unfiled_months: 0,
    levy_bump_after_month: null,
    apply_minimum: false,
    min_floor: 0,
    expect: { combined: 2500, ftf: 0, ftp: 2500 },
  },
  {
    toy_id: "MinFloor2024",
    net_amount_due: 2000,
    unpaid_by_month: [],
    unfiled_months: 1,
    levy_bump_after_month: null,
    apply_minimum: true,
    min_floor: 485,
    expect: { combined: 485, ftf: 485, ftp: 0 },
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

for (const cheat of [
  { flat_55_cheat: true },
  { dual_approver_cheat: true },
  { interest_as_penalty: true },
  { installment_025_silent: true },
  { partnership_6698_cheat: true },
  { scorp_6699_cheat: true },
  { c1_after_ftf_cap_cheat: true },
  { min_undercut_cheat: true },
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
console.log(`irc6651 toys: ${toys.length} dual-green + 8 rejects`);
