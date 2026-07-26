import { guard, json } from "@/lib/api";
import { archiveSpecies, createSpecies, listSpecies } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listSpecies({
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
    const row = archiveSpecies(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ species: row });
  }
  const species = createSpecies({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    nicheHint: body.nicheHint ?? "",
    nicheFloor: Number(body.nicheFloor ?? 0.4),
    stickinessCeiling: Number(body.stickinessCeiling ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!species) return json({ error: "bad_pack" }, { status: 400 });
  return json({ species }, { status: 201 });
}
