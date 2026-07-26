import { guard, json } from "@/lib/api";
import { archiveModule, createModule, listModules } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listModules({
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
    const module = archiveModule(body.id);
    if (!module) return json({ error: "not_found" }, { status: 404 });
    return json({ module });
  }
  const module = createModule({
    packId: body.packId,
    label: body.label,
    kind: body.kind,
    pathHint: body.pathHint,
    engagementFloor: Number(body.engagementFloor ?? 0.4),
    dropoutCeiling: Number(body.dropoutCeiling ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!module) return json({ error: "bad_pack" }, { status: 400 });
  return json({ module }, { status: 201 });
}
