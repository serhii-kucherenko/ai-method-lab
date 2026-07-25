import { guard, json } from "@/lib/api";
import { archiveProbe, createProbe, listProbes } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listProbes({
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
    const probe = archiveProbe(body.id);
    if (!probe) return json({ error: "not_found" }, { status: 404 });
    return json({ probe });
  }
  const probe = createProbe({
    packId: body.packId,
    label: body.label,
    kind: body.kind ?? "cooperative_split",
    splitHint: body.splitHint ?? "",
    strandCount: Number(body.strandCount ?? 2),
    coopFloor: Number(body.coopFloor ?? 0.35),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!probe) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ probe }, { status: 201 });
}
