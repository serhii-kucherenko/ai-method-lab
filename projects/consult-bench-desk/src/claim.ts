export const DISPLAY_NAME = "Consult Bench Desk";
export const PAPER_URL = "https://arxiv.org/abs/2607.09142v1";
export const AUTHORS_CODE = null;
export const CLAIM =
  "Real-world multimodal consult evaluation plans (text + image evidence, real consult cases, rubric across modalities) — vs text-only; image-blind scoring; synthetic-chat-only benches.";

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
