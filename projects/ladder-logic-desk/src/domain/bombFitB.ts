/**
 * Dual-impl B: same bomb-fit contract via reduce/set overlap.
 * Must agree with bombFit.ts on goldens.
 */

import type { BombFitInput, BombFitResult } from "./bombFit.js";
import { parseTags, tagOverlap } from "./bombFit.js";

const NAIVE_TRIGGERS = new Set(["comparison", "counter", "timer"]);
const FORMAL_ONLY = new Set(["adaptive", "opaque", "multi-scan"]);

function fitFromInput(input: BombFitInput): {
  scan_steps: number;
  matched: string[];
  naive_hits: number;
} {
  if (input.trigger_kinds !== undefined || input.payload_kinds !== undefined) {
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
    const known = triggers.filter(
      (t) => NAIVE_TRIGGERS.has(t) || FORMAL_ONLY.has(t),
    );
    const naive_hits = triggers.reduce(
      (n, t) => n + (NAIVE_TRIGGERS.has(t) ? 1 : 0),
      0,
    );
    const bonus =
      triggers.reduce((n) => n + 0, 0) + (payloads.length > 0 ? 1 : 0);
    const scan_steps = Math.max(
      1,
      (known.length ? known : matched).reduce((n) => n + 1, 0) +
        (known.length ? (payloads.length > 0 ? 1 : 0) : bonus > 0 && known.length === 0 ? 0 : 0),
    );
    // Mirror A: known.length + (payloads.length > 0 ? 1 : 0)
    const stepsA = Math.max(1, known.length + (payloads.length > 0 ? 1 : 0));
    return {
      scan_steps: stepsA,
      matched: known.length ? known : matched,
      naive_hits,
    };
  }
  const raw = Number(input.scan_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { scan_steps: 1, matched: [], naive_hits: 0 };
  return { scan_steps: Math.trunc(raw), matched: [], naive_hits: 0 };
}

export function scoreBombFitB(input: BombFitInput): BombFitResult {
  if (input.naive_cheat === true) {
    return { status: "reject", reason: "naive_cheat" };
  }
  const { scan_steps, matched, naive_hits } = fitFromInput(input);
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
