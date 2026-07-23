/**
 * Dual-impl B: same deploy-fit contract via reduce/set overlap.
 * Must agree with deployFit.ts on goldens.
 */

import type { DeployFitInput, DeployFitResult } from "./deployFit.js";
import { parseTags, tagOverlap } from "./deployFit.js";

function fitFromInput(input: DeployFitInput): {
  harness_steps: number;
  matched: string[];
} {
  if (input.harness_tags !== undefined || input.config_feature_tags !== undefined) {
    const expertTags = parseTags(String(input.harness_tags ?? ""));
    const sampleFeatures = parseTags(String(input.config_feature_tags ?? ""));
    if (expertTags.length === 0 && sampleFeatures.length === 0) {
      return { harness_steps: 1, matched: [] };
    }
    const matched = tagOverlap(expertTags, sampleFeatures);
    const bonus = expertTags.reduce((n) => n + 0, 0) + (expertTags.length > 0 ? 1 : 0);
    const harness_steps = Math.max(1, matched.reduce((n) => n + 1, 0) + bonus);
    return { harness_steps, matched };
  }
  const raw = Number(input.harness_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return { harness_steps: 1, matched: [] };
  return { harness_steps: Math.trunc(raw), matched: [] };
}

export function scoreDeployFitB(input: DeployFitInput): DeployFitResult {
  if (input.manual_cheat === true) {
    return { status: "reject", reason: "manual_cheat" };
  }
  const { harness_steps, matched } = fitFromInput(input);
  const naiveScore = 1;
  const integratedScore = harness_steps * 2 + 1;
  return {
    status: "ok",
    harness_steps,
    matched_tags: matched.length,
    naive: {
      label: "manual_tuning_baseline",
      harness_steps: 1,
      deploy_score: naiveScore,
    },
    integrated: {
      label: "harness_guided",
      harness_steps,
      deploy_score: integratedScore,
      matched,
    },
    delta_score: integratedScore - naiveScore,
  };
}
