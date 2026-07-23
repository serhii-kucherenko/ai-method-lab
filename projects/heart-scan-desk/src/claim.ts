export type PaperClaim = {
  paperId: string;
  title: string;
  codeUrl: string | null;
  buildClaim: string;
};

export function describeClaim(input: PaperClaim): { ok: true; line: string } | { ok: false; reason: string } {
  if (!input.paperId.trim()) return { ok: false, reason: "missing_paper_id" };
  if (!input.title.trim()) return { ok: false, reason: "missing_title" };
  if (!input.buildClaim.trim()) return { ok: false, reason: "missing_claim" };
  const code = input.codeUrl ? ` code=${input.codeUrl}` : "";
  return {
    ok: true,
    line: `${input.title} [${input.paperId}]${code} — ${input.buildClaim}`,
  };
}
