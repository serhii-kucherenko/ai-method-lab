/**
 * Dual-impl B: same modularity contract via reduce over tokenized passes.
 * Must agree with modularity.ts on goldens.
 */

import type { ModularityInput, ModularityResult } from "./modularity.js";

function tokenize(hint: string): string[] {
  return hint
    .replace(/[>|]/g, ",")
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

export function scoreModularityB(input: ModularityInput): ModularityResult {
  if (input.opaque_cheat === true) {
    return { status: "reject", reason: "opaque_cheat" };
  }
  const tokens = tokenize(String(input.mlir_pass_hint ?? ""));
  const layers = tokens.reduce((n) => n + 1, 0);
  const passLayers = layers === 0 ? 1 : layers;
  const naiveScore = 1;
  const layeredScore = passLayers * 2;
  return {
    status: "ok",
    pass_layers: passLayers,
    naive: {
      label: "opaque_monolith",
      pass_layers: 1,
      modularity_score: naiveScore,
    },
    paper_inspired: {
      label: "mlir_layered",
      pass_layers: passLayers,
      modularity_score: layeredScore,
    },
    delta_modularity: layeredScore - naiveScore,
  };
}
