export type AccrueInput = {
  day_count: string;
  face: number;
  coupon_rate: number;
  freq: number;
  prev_coupon: string;
  next_coupon: string;
  settle: string;
  maturity?: string;
  coupon_dates?: string[];
};

export type Cashflow = { date: string; amount: number };

export type AccrueResult =
  | {
      ok: true;
      periodic_coupon: number;
      days_elapsed: number | null;
      days_in_period: number | null;
      accrued: number;
      cashflows?: Cashflow[];
    }
  | { ok: false; reason: string };

type Ymd = { y: number; m: number; d: number };

function parseYmd(s: string): Ymd {
  const [y, m, d] = s.split("-").map(Number);
  return { y: y!, m: m!, d: d! };
}

function days30360(a: Ymd, b: Ymd): number {
  let d1 = a.d;
  let d2 = b.d;
  if (d1 === 31) d1 = 30;
  if (d2 === 31 && d1 === 30) d2 = 30;
  return (b.y - a.y) * 360 + (b.m - a.m) * 30 + (d2 - d1);
}

function actualDays(a: Ymd, b: Ymd): number {
  const t0 = Date.UTC(a.y, a.m - 1, a.d);
  const t1 = Date.UTC(b.y, b.m - 1, b.d);
  return Math.round((t1 - t0) / 86400000);
}

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

function periodDays30360(freq: number): number | null {
  if (freq === 2) return 180;
  if (freq === 4) return 90;
  if (freq === 1) return 360;
  return null;
}

export function accrueBond(input: AccrueInput): AccrueResult {
  if (![1, 2, 4].includes(input.freq)) return { ok: false, reason: "bad_freq" };
  if (input.maturity && input.settle > input.maturity) {
    return { ok: false, reason: "settle_after_maturity" };
  }
  const periodic = (input.face * input.coupon_rate) / input.freq;
  if (input.settle === input.next_coupon) {
    const out: AccrueResult = {
      ok: true,
      accrued: 0,
      days_elapsed: 0,
      days_in_period: null,
      periodic_coupon: periodic,
    };
    if (input.coupon_dates) {
      out.cashflows = input.coupon_dates.map((date) => ({
        date,
        amount: date === input.maturity ? periodic + input.face : periodic,
      }));
    }
    return out;
  }
  const prev = parseYmd(input.prev_coupon);
  const next = parseYmd(input.next_coupon);
  const settle = parseYmd(input.settle);
  let daysElapsed: number;
  let daysInPeriod: number | null;
  if (input.day_count === "30/360") {
    daysElapsed = days30360(prev, settle);
    daysInPeriod = periodDays30360(input.freq);
  } else if (input.day_count === "ACT/ACT") {
    daysElapsed = actualDays(prev, settle);
    daysInPeriod = actualDays(prev, next);
  } else {
    return { ok: false, reason: "unknown_day_count" };
  }
  if (daysInPeriod === null || daysInPeriod === 0) {
    return { ok: false, reason: "bad_freq" };
  }
  const accrued = round6(periodic * (daysElapsed / daysInPeriod));
  const out: AccrueResult = {
    ok: true,
    periodic_coupon: periodic,
    days_elapsed: daysElapsed,
    days_in_period: daysInPeriod,
    accrued,
  };
  if (input.coupon_dates) {
    out.cashflows = input.coupon_dates.map((date) => ({
      date,
      amount: date === input.maturity ? periodic + input.face : periodic,
    }));
  }
  return out;
}
