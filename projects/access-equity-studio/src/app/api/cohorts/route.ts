import { guard, json } from "@/lib/api";
import { archiveCohort, createCohort, listCohorts } from "@/store";
import type { CohortKind } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(listCohorts({
    q: url.searchParams.get("q") ?? undefined,
    packId: url.searchParams.get("packId") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 20),
  }));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const cohort = archiveCohort(body.id);
    if (!cohort) return json({ error: "not_found" }, { status: 404 });
    return json({ cohort });
  }
  const cohort = createCohort({
    packId: body.packId,
    label: body.label,
    kind: body.kind as CohortKind,
    regionHint: body.regionHint ?? "",
    strataCount: Number(body.strataCount ?? 1),
    accessMin: Number(body.accessMin ?? 0.3),
    accessMax: Number(body.accessMax ?? 0.9),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!cohort) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ cohort }, { status: 201 });
}
