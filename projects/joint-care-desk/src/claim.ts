export const DISPLAY_NAME = "Joint Care Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.12527v2";
export const AUTHORS_CODE = null;
export const CLAIM =
  "Dual-evidence musculoskeletal pathway plans (in-hospital evidence + external knowledge + stage-aware care) — vs naive parametric-memory-only, hospital-only, external-only, or stage-blind baselines.";

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
