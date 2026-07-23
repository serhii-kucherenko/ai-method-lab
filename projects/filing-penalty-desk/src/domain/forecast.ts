/**
 * Impl A — month-walk FTF/FTP forecast (ported from paper oracle).
 * Same-month file reduction, levy bump, aggregate caps, minimum floor.
 */

export type ForecastInput = {
  net_amount_due?: number | string;
  unpaid_by_month?: number[];
  unfiled_months?: number;
  levy_bump_after_month?: number | null;
  min_floor?: number;
  apply_minimum?: boolean;
  flat_55_cheat?: boolean;
  dual_approver_cheat?: boolean;
  interest_as_penalty?: boolean;
  installment_025_silent?: boolean;
  partnership_6698_cheat?: boolean;
  scorp_6699_cheat?: boolean;
  c1_after_ftf_cap_cheat?: boolean;
  min_undercut_cheat?: boolean;
};

export type ForecastOk = {
  status: "ok";
  ftf: number;
  ftp: number;
  combined: number;
  branch: string;
  algorithm_version: "fpd-v0";
};

export type ForecastReject = {
  status: "reject";
  reason: string;
};

export type ForecastResult = ForecastOk | ForecastReject;

function reject(reason: string): ForecastReject {
  return { status: "reject", reason };
}

export function forecast(input: ForecastInput): ForecastResult {
  if (input.flat_55_cheat === true) return reject("flat_55_cheat");
  if (input.dual_approver_cheat === true) return reject("dual_approver_cheat");
  if (input.interest_as_penalty === true) return reject("interest_as_penalty");
  if (input.installment_025_silent === true) return reject("installment_025_silent");
  if (input.partnership_6698_cheat === true) return reject("partnership_6698_cheat");
  if (input.scorp_6699_cheat === true) return reject("scorp_6699_cheat");
  if (input.c1_after_ftf_cap_cheat === true) return reject("c1_after_ftf_cap_cheat");
  if (input.min_undercut_cheat === true) return reject("min_undercut_cheat");

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
    const ftpI = i < ftpMonths ? rate * unpaid[i]! : 0;
    const ftfRaw = i < unfiledMonths && i < 5 ? 0.05 * net : 0;
    const ftfI = ftfRaw > 0 && ftpI > 0 ? Math.max(0, ftfRaw - ftpI) : ftfRaw;
    ftf += ftfI;
    ftp += ftpI;
  }

  if (net > 0 && ftf > 0.25 * net + 1e-9) ftf = 0.25 * net;
  const maxUnpaid = unpaid.reduce((m, u) => Math.max(m, u), 0);
  const ftpCapBase = maxUnpaid > 0 ? maxUnpaid : net;
  if (ftpCapBase > 0 && ftp > 0.25 * ftpCapBase + 1e-9) ftp = 0.25 * ftpCapBase;

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
    algorithm_version: "fpd-v0",
  };
}
