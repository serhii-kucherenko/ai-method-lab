export const DISPLAY_NAME = "Heart Scan Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.11287v1";
export const AUTHORS_CODE = null;
export const CLAIM =
  "Unified segmentation + phenotyping plans (joint structure+phenotype pathway, human-in-loop review, multicenter-aware validation) — vs segmentation-only; phenotype-from-raw-pixels-only; single-center unchecked.";

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
