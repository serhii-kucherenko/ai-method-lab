import { guard, json } from "@/lib/api";
import type { OutcomeLabel } from "@/domain/types";
import { createCohort, listCohorts } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listCohorts({
      q: url.searchParams.get("q") ?? undefined,
      segment: url.searchParams.get("segment") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const cohort = createCohort({
    packId: body.packId ? String(body.packId) : undefined,
    label: String(body.label ?? "Untitled cohort case"),
    caseSummary: String(body.caseSummary ?? ""),
    goldOutcome: (body.goldOutcome as OutcomeLabel) ?? "indeterminate",
    cohortSegment: String(body.cohortSegment ?? "general"),
    notes: body.notes ? String(body.notes) : undefined,
  });
  return json({ cohort }, { status: 201 });
}
