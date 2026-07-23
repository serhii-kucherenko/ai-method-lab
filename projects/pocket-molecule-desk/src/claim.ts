export const DISPLAY_NAME = "Pocket Molecule Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.12349v1";
export const AUTHORS_CODE = null;
export const CLAIM =
  "Pocket-conditioned + property-aware molecule plans (multi-scale pocket conditioning, binding affinity AND ADMET/developability steering) — vs unconditioned / ligand-only resemblance, affinity-only with no developability, or property-blind pocket fill.";

export type ClaimInput = {
  paperId: string;
  title: string;
  codeUrl: string | null;
  buildClaim: string;
};

export function describeClaim(input: ClaimInput) {
  const claim = input.buildClaim.trim();
  if (!claim) return { ok: false as const, error: "empty claim" };
  return {
    ok: true as const,
    line: `${DISPLAY_NAME} (${input.paperId}): ${claim}`,
  };
}
