import { guard, json } from "@/lib/api";
import { archiveOption, createOption, listOptions } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listOptions({
      q: url.searchParams.get("q") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
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
    const row = archiveOption(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json({ option: row });
  }
  const row = createOption({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    oversightHint: body.oversightHint ?? "",
    attributeCount: Number(body.attributeCount ?? 5),
    safetyFloor: Number(body.safetyFloor ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!row) return json({ error: "bad_request" }, { status: 400 });
  return json({ option: row }, { status: 201 });
}
