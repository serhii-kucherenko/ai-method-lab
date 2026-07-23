/**
 * Paper-inspired safer agentic control sketch: naive open-loop baseline vs
 * counterfactual physics injection (planner + timeseries sentinel).
 * Lab method experiment — not the authors' Neuro-Agentic Control system;
 * never brand the product as Neuro-Agentic Control.
 */

export type ControlFitInput = {
  /** Predicted peak without intervention (R_base). */
  base_peak?: number;
  /** Safety threshold θ. */
  threshold?: number;
  /** Forecast horizon H. */
  horizon?: number;
  /** Single action magnitude μ (negative = drain). */
  magnitude?: number;
  /** Single action duration δ. */
  duration?: number;
  /** Candidates as "mu:delta|mu:delta" (planner set). */
  candidates?: string;
  /** Cheat: claim safer while skipping counterfactual check — must reject. */
  open_loop_cheat?: boolean;
};

export type ControlFitOk = {
  status: "ok";
  base_peak: number;
  threshold: number;
  horizon: number;
  naive: {
    label: "naive_open_loop_baseline";
    risk_score: number;
    breached: boolean;
    action: "blind_execute" | "monitor";
  };
  safer: {
    label: "safer_agentic_cf";
    risk_score: number;
    breached: boolean;
    action: "monitor" | "intervene";
    rejected: number;
    selected_magnitude: number | null;
    selected_duration: number | null;
  };
  /** Positive delta means safer agentic reduced risk vs naive open-loop. */
  delta_score: number;
};

export type ControlFitReject = {
  status: "reject";
  reason: string;
};

export type ControlFitResult = ControlFitOk | ControlFitReject;

export type Candidate = { magnitude: number; duration: number };

const MAG_MIN = -60;
const MAG_MAX = -1;
const DUR_MIN = 5;
const DUR_MAX = 50;

export function parseCandidates(hint: string): Candidate[] {
  const parts = hint
    .split(/[|,]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const out: Candidate[] = [];
  for (const p of parts) {
    const [a, b] = p.split(":");
    const magnitude = Number(a);
    const duration = Number(b);
    if (!Number.isFinite(magnitude) || !Number.isFinite(duration)) continue;
    out.push({ magnitude, duration: Math.floor(duration) });
  }
  return out;
}

export function isFeasible(c: Candidate): boolean {
  if (!(c.magnitude <= MAG_MAX && c.magnitude >= MAG_MIN)) return false;
  if (!(c.duration >= DUR_MIN && c.duration <= DUR_MAX)) return false;
  return true;
}

/** Rising base forecast toward base_peak; risk without action is max = base_peak. */
export function baseForecast(basePeak: number, horizon: number): number[] {
  const H = Math.max(1, horizon);
  const start = Math.round(basePeak * 0.55);
  const series: number[] = [];
  for (let t = 0; t < H; t++) {
    series.push(Math.round(start + ((basePeak - start) * (t + 1)) / H));
  }
  return series;
}

/**
 * Counterfactual physics injection (paper eq. 1):
 * ŷ'_t = ŷ_t + μ·(t+1) if t < δ; else ŷ_t + μ·δ
 */
export function injectPhysics(
  forecast: number[],
  magnitude: number,
  duration: number,
): number[] {
  const δ = Math.max(0, Math.floor(duration));
  return forecast.map((y, t) => {
    const offset = t < δ ? magnitude * (t + 1) : magnitude * δ;
    return Math.round(y + offset);
  });
}

export function peakRisk(series: number[]): number {
  if (!series.length) return 0;
  return Math.max(...series);
}

function resolveInputs(input: ControlFitInput): {
  base_peak: number;
  threshold: number;
  horizon: number;
  candidates: Candidate[];
} {
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
  return { base_peak, threshold, horizon, candidates };
}

export function scoreControlFit(input: ControlFitInput): ControlFitResult {
  if (input.open_loop_cheat === true) {
    return { status: "reject", reason: "open_loop_cheat" };
  }

  const { base_peak, threshold, horizon, candidates } = resolveInputs(input);
  const forecast = baseForecast(base_peak, horizon);
  const R_base = peakRisk(forecast);

  // Naive open-loop: blind-execute first candidate with no feasibility / CF gate.
  let naiveRisk = R_base;
  let naiveAction: "blind_execute" | "monitor" = "monitor";
  if (candidates.length > 0) {
    const first = candidates[0];
    const injected = injectPhysics(forecast, first.magnitude, first.duration);
    naiveRisk = peakRisk(injected);
    naiveAction = "blind_execute";
  }

  // Safer agentic: feasibility + CF injection; pick min risk or Monitor.
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
    const injected = injectPhysics(forecast, c.magnitude, c.duration);
    const R_sim = peakRisk(injected);
    // Hallucination / ineffective: do not worsen vs baseline.
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
