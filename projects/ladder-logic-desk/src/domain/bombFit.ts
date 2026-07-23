/**
 * Paper-inspired bomb-fit sketch: naive scan baseline vs formal trigger synthesis.
 * Lab method experiment — not the authors' verifier; never brand as their tool names.
 */

export type BombFitInput = {
  scan_depth?: number;
  /** Comma / pipe / > separated trigger kinds (comparison, counter, timer, adaptive, opaque, multi-scan). */
  trigger_kinds?: string;
  /** Comma / pipe / > separated payload kinds (actuator, denial, sensor-forge). */
  payload_kinds?: string;
  /** Cheat: claim formal while forcing naive-only — must reject. */
  naive_cheat?: boolean;
};

export type BombFitOk = {
  status: "ok";
  scan_steps: number;
  matched_triggers: number;
  naive: {
    label: "naive_scan_baseline";
    scan_steps: 1;
    bomb_score: number;
  };
  formal: {
    label: "formal_trigger_synthesis";
    scan_steps: number;
    bomb_score: number;
    matched: string[];
  };
  delta_score: number;
};

export type BombFitReject = {
  status: "reject";
  reason: string;
};

export type BombFitResult = BombFitOk | BombFitReject;

/** Triggers a naive CFG/scan triage can see. */
const NAIVE_TRIGGERS = new Set(["comparison", "counter", "timer"]);

/** Triggers that need semantic / formal reasoning. */
const FORMAL_ONLY = new Set(["adaptive", "opaque", "multi-scan"]);

export function parseTags(hint: string): string[] {
  const parts = hint
    .split(/[,>|]/)
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    if (!seen.has(p)) {
      seen.add(p);
      out.push(p);
    }
  }
  return out;
}

export function tagOverlap(left: string[], right: string[]): string[] {
  const sample = new Set(right);
  return left.filter((t) => sample.has(t));
}

export function resolveScanSteps(input: BombFitInput): {
  scan_steps: number;
  matched: string[];
  naive_hits: number;
} {
  const hasTags =
    input.trigger_kinds !== undefined || input.payload_kinds !== undefined;
  if (hasTags) {
    const triggers = parseTags(String(input.trigger_kinds ?? ""));
    const payloads = parseTags(String(input.payload_kinds ?? ""));
    if (triggers.length === 0 && payloads.length === 0) {
      return { scan_steps: 1, matched: [], naive_hits: 0 };
    }
    const matched = tagOverlap(triggers, [
      ...NAIVE_TRIGGERS,
      ...FORMAL_ONLY,
      ...payloads,
    ]);
    // Prefer listing trigger kinds that are known classes
    const known = triggers.filter(
      (t) => NAIVE_TRIGGERS.has(t) || FORMAL_ONLY.has(t),
    );
    const naive_hits = triggers.filter((t) => NAIVE_TRIGGERS.has(t)).length;
    const scan_steps = Math.max(
      1,
      known.length + (payloads.length > 0 ? 1 : 0),
    );
    return {
      scan_steps,
      matched: known.length ? known : matched,
      naive_hits,
    };
  }
  const raw = Number(input.scan_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) {
    return { scan_steps: 1, matched: [], naive_hits: 0 };
  }
  return { scan_steps: Math.floor(raw), matched: [], naive_hits: 0 };
}

export function scoreBombFit(input: BombFitInput): BombFitResult {
  if (input.naive_cheat === true) {
    return { status: "reject", reason: "naive_cheat" };
  }
  const { scan_steps, matched, naive_hits } = resolveScanSteps(input);
  // Naive scan: flat score from syntactic hits only (or 1 when depth-only).
  const naiveScore =
    input.trigger_kinds !== undefined || input.payload_kinds !== undefined
      ? Math.max(1, naive_hits)
      : 1;
  const formalScore = scan_steps * 2 + 1;
  return {
    status: "ok",
    scan_steps,
    matched_triggers: matched.length,
    naive: {
      label: "naive_scan_baseline",
      scan_steps: 1,
      bomb_score: naiveScore,
    },
    formal: {
      label: "formal_trigger_synthesis",
      scan_steps,
      bomb_score: formalScore,
      matched,
    },
    delta_score: formalScore - naiveScore,
  };
}
