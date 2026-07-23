export const DISPLAY_NAME = "Tactile Data Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.14588v1";
export const AUTHORS_CODE = "https://github.com/accessible-data-vis/feelogue";
export const CLAIM = "Touch-first chart sensemaking with agent for calculation, then verify on the tactile chart — vs speech-only answers that skip tactile grounding.";

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
