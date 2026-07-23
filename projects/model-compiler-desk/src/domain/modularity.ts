/**
 * Paper-inspired modularity sketch for MLIR-style pass layers.
 * Lab method experiment — not the authors' compiler.
 */

export type ModularityInput = {
  mlir_pass_hint: string;
  /** Cheat: force opaque-only scoring as if layered — must reject. */
  opaque_cheat?: boolean;
};

export type ModularityOk = {
  status: "ok";
  pass_layers: number;
  naive: { label: "opaque_monolith"; pass_layers: 1; modularity_score: number };
  paper_inspired: {
    label: "mlir_layered";
    pass_layers: number;
    modularity_score: number;
  };
  delta_modularity: number;
};

export type ModularityReject = {
  status: "reject";
  reason: string;
};

export type ModularityResult = ModularityOk | ModularityReject;

export function countPassLayers(hint: string): number {
  const parts = hint
    .split(/[,>|]/)
    .map((p) => p.trim())
    .filter(Boolean);
  return Math.max(1, parts.length);
}

export function scoreModularity(input: ModularityInput): ModularityResult {
  if (input.opaque_cheat === true) {
    return { status: "reject", reason: "opaque_cheat" };
  }
  const hint = String(input.mlir_pass_hint ?? "");
  const layers = countPassLayers(hint);
  const naive = {
    label: "opaque_monolith" as const,
    pass_layers: 1 as const,
    modularity_score: 1,
  };
  const paper_inspired = {
    label: "mlir_layered" as const,
    pass_layers: layers,
    modularity_score: layers * 2,
  };
  return {
    status: "ok",
    pass_layers: layers,
    naive,
    paper_inspired,
    delta_modularity: paper_inspired.modularity_score - naive.modularity_score,
  };
}
