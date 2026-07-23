export const DISPLAY_NAME = "Chest Xray Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.09305v1";
export const AUTHORS_CODE = null;
export const CLAIM =
  "Classify → localize → clinically validate plans (label + region localization pathway, human-in-loop review, clinical validation awareness) — vs classification-only; localization without clinical gate; unverified single-threshold alerts.";

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
