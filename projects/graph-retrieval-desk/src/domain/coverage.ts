/**
 * Paper-inspired coverage sketch: single-hop opaque vs extract→consolidate→retrieve.
 * Lab method experiment — not the authors' multi-step graph retrieval engine.
 */

export type CoverageInput = {
  hop_depth?: number;
  /** Comma / pipe / > separated stage labels; length becomes hop_steps when set. */
  stages_hint?: string;
  /** Cheat: claim multi-step while forcing single-hop scoring — must reject. */
  single_hop_cheat?: boolean;
};

export type CoverageOk = {
  status: "ok";
  hop_steps: number;
  naive: {
    label: "single_hop_opaque";
    hop_steps: 1;
    coverage_score: number;
  };
  paper_inspired: {
    label: "extract_consolidate_retrieve";
    hop_steps: number;
    coverage_score: number;
    stages: string[];
  };
  delta_coverage: number;
};

export type CoverageReject = {
  status: "reject";
  reason: string;
};

export type CoverageResult = CoverageOk | CoverageReject;

const DEFAULT_STAGES = ["extract", "consolidate", "retrieve"];

export function countStages(hint: string): string[] {
  const parts = hint
    .split(/[,>|]/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts : ["retrieve"];
}

export function resolveHopSteps(input: CoverageInput): number {
  if (input.stages_hint !== undefined && String(input.stages_hint).length >= 0) {
    if (String(input.stages_hint).trim() === "") {
      return 1;
    }
    return Math.max(1, countStages(String(input.stages_hint)).length);
  }
  const raw = Number(input.hop_depth ?? 1);
  if (!Number.isFinite(raw) || raw < 1) return 1;
  return Math.floor(raw);
}

export function scoreCoverage(input: CoverageInput): CoverageResult {
  if (input.single_hop_cheat === true) {
    return { status: "reject", reason: "single_hop_cheat" };
  }
  const hopSteps = resolveHopSteps(input);
  const stages =
    input.stages_hint !== undefined && String(input.stages_hint).trim()
      ? countStages(String(input.stages_hint))
      : DEFAULT_STAGES.slice(0, Math.min(3, hopSteps)).concat(
          hopSteps > 3
            ? Array.from({ length: hopSteps - 3 }, (_, i) => `hop_${i + 4}`)
            : [],
        );
  const stageLabels =
    stages.length >= hopSteps
      ? stages.slice(0, hopSteps)
      : [
          ...stages,
          ...Array.from(
            { length: hopSteps - stages.length },
            (_, i) => `hop_${stages.length + i + 1}`,
          ),
        ];
  const naive = {
    label: "single_hop_opaque" as const,
    hop_steps: 1 as const,
    coverage_score: 1,
  };
  const paper_inspired = {
    label: "extract_consolidate_retrieve" as const,
    hop_steps: hopSteps,
    coverage_score: hopSteps * 2 + 1,
    stages: stageLabels,
  };
  return {
    status: "ok",
    hop_steps: hopSteps,
    naive,
    paper_inspired,
    delta_coverage: paper_inspired.coverage_score - naive.coverage_score,
  };
}
