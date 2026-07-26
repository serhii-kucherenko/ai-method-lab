import { guard, json } from "@/lib/api";
import { archiveCarrier, createCarrier, listCarriers } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listCarriers({
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
    const row = archiveCarrier(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ carrier: row });
  }
  const carrier = createCarrier({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    poreHint: body.poreHint,
    orderFloor: Number(body.orderFloor ?? 0.5),
    chemoFloor: Number(body.chemoFloor ?? 0.45),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!carrier) return json({ error: "bad_pack" }, { status: 400 });
  return json({ carrier }, { status: 201 });
}
