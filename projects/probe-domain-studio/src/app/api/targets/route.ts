import { guard, json } from "@/lib/api";
import { archiveTarget, createTarget, listTargets } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listTargets({
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
    const target = archiveTarget(body.id);
    if (!target) return json({ error: "not_found" }, { status: 404 });
    return json({ target });
  }
  const target = createTarget({
    packId: body.packId,
    label: body.label,
    kind: body.kind ?? "wild_type",
    sequenceHint: body.sequenceHint ?? "",
    lengthNt: Number(body.lengthNt ?? 48),
    bridgeFloor: Number(body.bridgeFloor ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!target) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ target }, { status: 201 });
}
