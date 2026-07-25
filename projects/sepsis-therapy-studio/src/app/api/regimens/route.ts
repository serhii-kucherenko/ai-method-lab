import { guard, json } from "@/lib/api";
import { archiveRegimen, createRegimen, listRegimens } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listRegimens({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const regimen = archiveRegimen(body.id);
    if (!regimen) return json({ error: "not_found" }, { status: 404 });
    return json({ regimen });
  }
  const regimen = createRegimen({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    antibioticHint: body.antibioticHint ?? body.eligibilityHint ?? "",
    caseCount: Number(body.caseCount ?? 1),
    hardnessMin: Number(body.hardnessMin ?? 0.2),
    hardnessMax: Number(body.hardnessMax ?? 0.8),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!regimen) return json({ error: "invalid_pack" }, { status: 400 });
  return json({ regimen }, { status: 201 });
}
