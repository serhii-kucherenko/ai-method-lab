import { guard, json } from "@/lib/api";
import { archiveCatalyst, createCatalyst, listCatalysts } from "@/store";
import type { CatalystKind } from "@/domain/types";

const KINDS: CatalystKind[] = [
  "photocatalytic_aminoaryl",
  "copper_catalyzed_aminoaryl",
  "photo_copper_soft_sim",
  "mixed_catalyst",
  "dual_route_soft_sim",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listCatalysts({
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
    const row = archiveCatalyst(body.id);
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
    !KINDS.includes(body.kind as CatalystKind)
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createCatalyst({
    packId: body.packId,
    label: body.label,
    kind: body.kind as CatalystKind,
    modelHint: body.modelHint,
    yieldFloor: body.yieldFloor,
    evidenceFloor: body.evidenceFloor,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
