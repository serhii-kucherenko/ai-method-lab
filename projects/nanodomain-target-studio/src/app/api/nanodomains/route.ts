import { guard, json } from "@/lib/api";
import { archiveNanodomain, createNanodomain, listNanodomains } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listNanodomains({
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
    const nanodomain = archiveNanodomain(body.id);
    if (!nanodomain) return json({ error: "not_found" }, { status: 404 });
    return json({ nanodomain });
  }
  const nanodomain = createNanodomain({
    packId: body.packId ?? "pack-demo",
    label: body.label,
    kind: body.kind ?? "camp_pka_local",
    locusHint: body.locusHint ?? "",
    localizationFloor: Number(body.localizationFloor ?? 0.4),
    diastolicFloor: Number(body.diastolicFloor ?? 0.4),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!nanodomain) return json({ error: "bad_pack" }, { status: 400 });
  return json({ nanodomain }, { status: 201 });
}
