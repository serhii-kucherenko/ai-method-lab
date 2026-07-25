import { guard, json } from "@/lib/api";
import { archiveLineage, createLineage, listLineages } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listLineages({
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
    const lineage = archiveLineage(body.id);
    if (!lineage) return json({ error: "not_found" }, { status: 404 });
    return json({ lineage });
  }
  const lineage = createLineage({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "stellate_include",
    mixHint: body.mixHint ?? "",
    stellateFloor: Number(body.stellateFloor ?? 0.3),
    cholangiocyteFloor: Number(body.cholangiocyteFloor ?? 0.25),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!lineage) return json({ error: "bad_pack" }, { status: 400 });
  return json({ lineage }, { status: 201 });
}
