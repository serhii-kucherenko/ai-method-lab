export type SettleInput = {
  interval_start?: string;
  meter_interval_start?: string;
  schedule_interval_start?: string;
  meter_kwh: number;
  schedule_kwh: number;
  delivery_factor: number;
  imbalance_price: number;
  apply_loss_twice?: boolean;
  loss_after_price?: boolean;
};

export type SettleResult =
  | {
      ok: true;
      adjusted_kwh: number;
      imbalance_kwh: number;
      charge: number;
    }
  | { ok: false; reason: string };

function round6(n: number): number {
  return Math.round(n * 1e6) / 1e6;
}

export function settleInterval(input: SettleInput): SettleResult {
  if (input.apply_loss_twice) return { ok: false, reason: "double_loss" };
  if (input.loss_after_price) return { ok: false, reason: "loss_after_price" };

  const meterStart = input.interval_start ?? input.meter_interval_start;
  const schedStart = input.interval_start ?? input.schedule_interval_start;
  if (!meterStart || !schedStart) return { ok: false, reason: "interval_required" };
  if (meterStart !== schedStart) return { ok: false, reason: "interval_mismatch" };
  if (!(input.delivery_factor > 0)) return { ok: false, reason: "delivery_factor_invalid" };

  const adjusted = input.meter_kwh * input.delivery_factor;
  const imbalance = adjusted - input.schedule_kwh;
  const charge = imbalance * input.imbalance_price;
  return {
    ok: true,
    adjusted_kwh: round6(adjusted),
    imbalance_kwh: round6(imbalance),
    charge: round6(charge),
  };
}
