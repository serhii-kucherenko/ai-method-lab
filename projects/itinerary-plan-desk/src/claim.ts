export const DISPLAY_NAME = "Itinerary Plan Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.15552v1";
export const AUTHORS_CODE = "https://github.com/Official529Tech/pla-itinerary";
export const CLAIM =
  "Feasible itinerary candidates first; preference reward ranks them; local adapt keeps every edit feasible — vs preference-only schedules that break hard windows.";

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
