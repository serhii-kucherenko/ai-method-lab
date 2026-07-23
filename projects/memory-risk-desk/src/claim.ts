export const DISPLAY_NAME = "Memory Risk Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.11656v2";
export const AUTHORS_CODE = null;
export const CLAIM =
  "Imputation-free + calibrated-uncertainty plans (native missingness, calibrated risk bands across cohorts) — vs mean/mode imputation then flat classifier; uncalibrated high-confidence scores; single-cohort-only ignoring site shift.";

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
