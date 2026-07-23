/**
 * Dual-impl B: same coverage contract via reduce over hop steps.
 * Must agree with coverage.ts on goldens.
 */

import type { CoverageInput, CoverageResult } from "./coverage.js";
import { countStages } from "./coverage.js";

const DEFAULT_STAGES = ["extract", "consolidate", "retrieve"];

function hopFromInput(input: CoverageInput): number {
  if (input.stages_hint !== undefined) {
    const trimmed = String(input.stages_hint).trim();
    if (!trimmed) return 1;
    return countStages(trimmed).reduce((n) => n + 1, 0) || 1;
  }
  const raw = Number(input.hop_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return 1;
  return Math.trunc(raw);
}

export function scoreCoverageB(input: CoverageInput): CoverageResult {
  if (input.single_hop_cheat === true) {
    return { status: "reject", reason: "single_hop_cheat" };
  }
  const hopSteps = hopFromInput(input);
  let stageLabels: string[];
  if (input.stages_hint !== undefined && String(input.stages_hint).trim()) {
    const counted = countStages(String(input.stages_hint));
    stageLabels = counted.slice(0, hopSteps);
    while (stageLabels.length < hopSteps) {
      stageLabels.push(`hop_${stageLabels.length + 1}`);
    }
  } else {
    stageLabels = DEFAULT_STAGES.slice(0, Math.min(3, hopSteps));
    let i = 4;
    while (stageLabels.length < hopSteps) {
      stageLabels.push(`hop_${i++}`);
    }
  }
  const naiveScore = 1;
  const paperScore = hopSteps * 2 + 1;
  return {
    status: "ok",
    hop_steps: hopSteps,
    naive: {
      label: "single_hop_opaque",
      hop_steps: 1,
      coverage_score: naiveScore,
    },
    paper_inspired: {
      label: "extract_consolidate_retrieve",
      hop_steps: hopSteps,
      coverage_score: paperScore,
      stages: stageLabels,
    },
    delta_coverage: paperScore - naiveScore,
  };
}
