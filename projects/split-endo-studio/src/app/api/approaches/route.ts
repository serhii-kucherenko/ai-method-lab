import { guard, json } from "@/lib/api";
import { archiveApproach, createApproach, listApproaches } from "@/store";
import type { ApproachKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listApproaches({
      q: url.searchParams.get("q") ?? undefined,
      packId: url.searchParams.get("packId") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (body.action === "archive" && typeof body.id === "string") {
    const row = archiveApproach(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.portalHint !== "string" ||
    typeof body.bloodLossFloor !== "number" ||
    typeof body.recoveryFloor !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createApproach({
    packId: body.packId,
    label: body.label,
    kind: body.kind as ApproachKind,
    portalHint: body.portalHint,
    bloodLossFloor: body.bloodLossFloor,
    recoveryFloor: body.recoveryFloor,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
