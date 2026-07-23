/**
 * Dual-impl twin of controlFit.ts — must agree on all golden fixtures.
 */
import {
  baseForecast,
  injectPhysics,
  isFeasible,
  parseCandidates,
  peakRisk,
  type ControlFitInput,
  type ControlFitResult,
  type Candidate,
} from "./controlFit.js";

export function scoreControlFitB(input: ControlFitInput): ControlFitResult {
  if (input.open_loop_cheat === true) {
    return { status: "reject", reason: "open_loop_cheat" };
  }

  const rawPeak = Number(input.base_peak ?? 1100);
  const base_peak =
    !Number.isFinite(rawPeak) || rawPeak < 1 ? 1100 : Math.floor(rawPeak);
  const rawTh = Number(input.threshold ?? 1000);
  const threshold =
    !Number.isFinite(rawTh) || rawTh < 1 ? 1000 : Math.floor(rawTh);
  const rawH = Number(input.horizon ?? 20);
  const horizon =
    !Number.isFinite(rawH) || rawH < 1 ? 20 : Math.floor(rawH);

  let candidates: Candidate[] = [];
  if (input.candidates !== undefined) {
    candidates = parseCandidates(String(input.candidates));
  } else if (input.magnitude !== undefined || input.duration !== undefined) {
    const magnitude = Number(input.magnitude ?? -20);
    const duration = Number(input.duration ?? 10);
    candidates = [
      {
        magnitude: Number.isFinite(magnitude) ? magnitude : -20,
        duration: Number.isFinite(duration) ? Math.floor(duration) : 10,
      },
    ];
  }

  const forecast = baseForecast(base_peak, horizon);
  const R_base = peakRisk(forecast);

  let naiveRisk = R_base;
  let naiveAction: "blind_execute" | "monitor" = "monitor";
  if (candidates.length > 0) {
    const first = candidates[0];
    naiveRisk = peakRisk(
      injectPhysics(forecast, first.magnitude, first.duration),
    );
    naiveAction = "blind_execute";
  }

  let saferRisk = R_base;
  let saferAction: "monitor" | "intervene" = "monitor";
  let rejected = 0;
  let selected_magnitude: number | null = null;
  let selected_duration: number | null = null;

  for (const c of candidates) {
    if (!isFeasible(c)) {
      rejected += 1;
      continue;
    }
    const R_sim = peakRisk(injectPhysics(forecast, c.magnitude, c.duration));
    if (R_sim >= R_base) {
      rejected += 1;
      continue;
    }
    if (R_sim < saferRisk) {
      saferRisk = R_sim;
      saferAction = "intervene";
      selected_magnitude = c.magnitude;
      selected_duration = c.duration;
    } else {
      rejected += 1;
    }
  }

  return {
    status: "ok",
    base_peak,
    threshold,
    horizon,
    naive: {
      label: "naive_open_loop_baseline",
      risk_score: naiveRisk,
      breached: naiveRisk >= threshold,
      action: naiveAction,
    },
    safer: {
      label: "safer_agentic_cf",
      risk_score: saferRisk,
      breached: saferRisk >= threshold,
      action: saferAction,
      rejected,
      selected_magnitude,
      selected_duration,
    },
    delta_score: naiveRisk - saferRisk,
  };
}
