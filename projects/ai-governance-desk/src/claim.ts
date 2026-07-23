export const DISPLAY_NAME = "AI Governance Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.14585v1";
export const AUTHORS_CODE = null;
export const AUTHORS_OSF = "https://osf.io/5rz9p/";
export const CLAIM =
  "Conjoint-style AI governance preferences: safety over innovation, public over private, international over national — versus naive always-innovation / private / national baselines.";

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
