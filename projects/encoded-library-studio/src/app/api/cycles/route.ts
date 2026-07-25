import { guard, json } from "@/lib/api";
import { archiveCycle, createCycle, listCycles } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listCycles({
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
    const cycle = archiveCycle(body.id);
    if (!cycle) return json({ error: "not_found" }, { status: 404 });
    return json({ cycle });
  }
  const cycle = createCycle({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    cycleHint: body.cycleHint,
    roundCount: Number(body.roundCount ?? 2),
    enrichmentFloor: Number(body.enrichmentFloor ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!cycle) return json({ error: "bad_pack" }, { status: 400 });
  return json({ cycle }, { status: 201 });
}
