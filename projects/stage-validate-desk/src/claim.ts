export const DISPLAY_NAME = "Stage Validate Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.14568v1";
export const AUTHORS_CODE = null;
export const CLAIM = "Stage-validated inference plans: gate each stage against a reference and measure long-context / bit-width choices — vs naive intuition that skips stage gates (short-bench only, assume 4-bit faster, assume hand GEMM is the ceiling).";

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
