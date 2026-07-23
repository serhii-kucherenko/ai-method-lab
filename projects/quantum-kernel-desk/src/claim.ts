export const DISPLAY_NAME = "Quantum Kernel Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.11701v1";
export const AUTHORS_CODE = null;
export const CLAIM =
  "Quantum multiple-kernel SAR plans (multi-kernel quantum-style feature maps for activity scoring) — vs classical single linear kernel, single RBF-only, or feature-blind flat scores.";

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
