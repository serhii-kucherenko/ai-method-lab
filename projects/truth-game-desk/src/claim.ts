export const DISPLAY_NAME = "Truth Game Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.08403v1";
export const AUTHORS_CODE = null;
export const CLAIM =
  "Game-theoretic multi-agent truth plans (structured challenge, payoff scoring, multi-agent game awareness) — vs single-agent; flat majority vote without game structure; confidence-only filters.";

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
