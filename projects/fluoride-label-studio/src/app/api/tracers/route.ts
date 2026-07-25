import { guard, json } from "@/lib/api";
import { archiveTracer, createTracer, listTracers } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listTracers({
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
    const row = archiveTracer(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ tracer: row });
  }
  const tracer = createTracer({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "small_molecule_pet",
    targetHint: body.targetHint ?? "",
    specificActivityFloor: Number(body.specificActivityFloor ?? 0.35),
    yieldFloor: Number(body.yieldFloor ?? 0.4),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!tracer) return json({ error: "bad_pack" }, { status: 400 });
  return json({ tracer }, { status: 201 });
}
