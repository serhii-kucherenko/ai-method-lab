import { guard, json } from "@/lib/api";
import { archivePolicy, createPolicy, listPolicies } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPolicies({
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
    const policy = archivePolicy(body.id);
    if (!policy) return json({ error: "not_found" }, { status: 404 });
    return json({ policy });
  }
  const policy = createPolicy({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    recipeHint: body.recipeHint ?? body.exoHint ?? "",
    controlCount: Number(body.controlCount ?? body.viewCount ?? 3),
    severityFloor: Number(body.severityFloor ?? body.baselineMeters ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!policy) return json({ error: "invalid_pack" }, { status: 400 });
  return json({ policy }, { status: 201 });
}
