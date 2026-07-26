import { guard, json } from "@/lib/api";
import { archiveHit, createHit, listHits } from "@/store";
import type { HitKind } from "@/domain/types";

const KINDS: HitKind[] = [
  "structure_based_dhodh",
  "naive_library_baseline",
  "dock_pharmacophore_soft_sim",
  "mixed_hit",
  "dual_screen_soft_sim",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listHits({
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
    const row = archiveHit(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.modelHint !== "string" ||
    typeof body.yieldFloor !== "number" ||
    typeof body.evidenceFloor !== "number" ||
    !KINDS.includes(body.kind as HitKind)
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createHit({
    packId: body.packId,
    label: body.label,
    kind: body.kind as HitKind,
    modelHint: body.modelHint,
    yieldFloor: body.yieldFloor,
    evidenceFloor: body.evidenceFloor,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
