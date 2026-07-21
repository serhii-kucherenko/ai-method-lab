export type RateBlock = { up_to_kwh: number | null; rate: number };

export type BillInput = {
  total_kwh: number;
  current_peak_kw: number;
  prior_peak_kw: number;
  ratchet_pct: number;
  demand_rate: number;
  blocks: RateBlock[];
};

export type BillResult =
  | {
      ok: true;
      energy_charge: number;
      billing_demand_kw: number;
      demand_charge: number;
      total_charge: number;
    }
  | { ok: false; reason: string };

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

export function billTariff(input: BillInput): BillResult {
  const blocks = input.blocks ?? [];
  if (!blocks.length) return { ok: false, reason: "empty_blocks" };
  if (!(input.total_kwh >= 0) || !(input.current_peak_kw >= 0) || !(input.prior_peak_kw >= 0)) {
    return { ok: false, reason: "negative_input" };
  }
  if (!(input.ratchet_pct > 0 && input.ratchet_pct <= 1)) {
    return { ok: false, reason: "ratchet_pct_invalid" };
  }
  let prev = 0;
  for (const b of blocks) {
    if (typeof b.rate !== "number" || b.rate < 0) return { ok: false, reason: "bad_rate" };
    if (b.up_to_kwh !== null) {
      if (b.up_to_kwh <= prev) return { ok: false, reason: "blocks_unsorted" };
      prev = b.up_to_kwh;
    }
  }

  let remaining = input.total_kwh;
  let energy = 0;
  prev = 0;
  for (const b of blocks) {
    if (remaining <= 0) break;
    const width = b.up_to_kwh === null ? remaining : b.up_to_kwh - prev;
    const take = Math.min(remaining, width);
    energy += take * b.rate;
    remaining -= take;
    if (b.up_to_kwh !== null) prev = b.up_to_kwh;
  }
  const billingDemand = Math.max(input.current_peak_kw, input.prior_peak_kw * input.ratchet_pct);
  const demand = billingDemand * input.demand_rate;
  return {
    ok: true,
    energy_charge: round6(energy),
    billing_demand_kw: round6(billingDemand),
    demand_charge: round6(demand),
    total_charge: round6(energy + demand),
  };
}
