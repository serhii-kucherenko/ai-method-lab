import { guard, json } from "@/lib/api";
import { archiveMasldCase, createMasldCase, listMasldCases } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listMasldCases({
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
    const row = archiveMasldCase(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ masld: row });
  }
  const masld = createMasldCase({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    lipidAccumulation: Number(body.lipidAccumulation ?? 0.5),
    inflammationCue: Number(body.inflammationCue ?? 0.4),
    phenotypeHint: body.phenotypeHint ?? "lipid,inflammation",
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!masld) return json({ error: "bad_pack" }, { status: 400 });
  return json({ masld }, { status: 201 });
}
