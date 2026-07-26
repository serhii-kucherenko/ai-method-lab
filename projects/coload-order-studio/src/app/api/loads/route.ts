import { guard, json } from "@/lib/api";
import { archiveLoad, createLoad, listLoads } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listLoads({
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
    const row = archiveLoad(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ load: row });
  }
  const load = createLoad({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    orderHint: body.orderHint,
    photoFloor: Number(body.photoFloor ?? 0.45),
    leakCeiling: Number(body.leakCeiling ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!load) return json({ error: "bad_pack" }, { status: 400 });
  return json({ load }, { status: 201 });
}
