export const DISPLAY_NAME = "Prompt Cache Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.15516v1";
export const AUTHORS_CODE = null;
export const CLAIM =
  "Query-agnostic compressed prefixes with tier-preserving ratio bounds beat vanilla, cache-only, and query-aware strategies under a two-tier hit-rate cost model.";

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
