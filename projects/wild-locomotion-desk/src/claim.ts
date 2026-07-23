export const DISPLAY_NAME = "Wild Locomotion Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.13579v1";
export const AUTHORS_CODE = null;
export const CLAIM = "Multi-skill perceptive quadruped plans with autonomous skill transitions for mixed obstacles — vs a single-skill / flat-terrain-only naive policy that fails on stairs, gaps, and hurdles.";

export type ClaimInput = {
  paperId: string;
  title: string;
  codeUrl: string | null;
  buildClaim: string;
};

export function describeClaim(input: ClaimInput) {
  const text = input.buildClaim.trim();
  if (!text) return { ok: false as const, error: "empty claim" };
  return {
    ok: true as const,
    line: `${DISPLAY_NAME} (${input.paperId}): ${text}`,
  };
}
