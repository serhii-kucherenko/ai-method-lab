export const DISPLAY_NAME = "Evidence Synthesis Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.15247v1";
export const AUTHORS_CODE = null;
export const CLAIM =
  "Screen and eligibility before pooling: standardized effect sizes + random-effects synthesis with audit — versus naive average of reported numbers that skip screening discipline.";

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
