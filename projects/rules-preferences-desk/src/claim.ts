export const DISPLAY_NAME = "Rules Preferences Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.15562v1";
export const AUTHORS_CODE = "https://github.com/Official529Tech/rlo-checklist";
export const CLAIM =
  "Hard feasibility rules must coexist with soft preferences; constrained selection vs naive preference-only.";

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
