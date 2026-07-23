export const DISPLAY_NAME = "Prompt Cache Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.15516v1";
export const AUTHORS_CODE = null;
export const CLAIM = "Two-tier cache-aware prompt compression: decide what to compress vs reuse from cache under API cost — vs naive always-compress or always-full-prompt baselines.";

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
