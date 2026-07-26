import { guard, json } from "@/lib/api";
import { archiveVector, createVector, listVectors } from "@/store";
import type { VectorKind } from "@/domain/types";

const KINDS: VectorKind[] = [
  "myo7a_gene_supplement",
  "myo7b_activation",
  "dual_aav_soft_sim",
  "mixed_vector",
  "dual_pathway_soft_sim",
  "custom",
];

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listVectors({
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
    const row = archiveVector(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.modelHint !== "string" ||
    typeof body.rescueFloor !== "number" ||
    typeof body.evidenceFloor !== "number" ||
    !KINDS.includes(body.kind as VectorKind)
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createVector({
    packId: body.packId,
    label: body.label,
    kind: body.kind as VectorKind,
    modelHint: body.modelHint,
    rescueFloor: body.rescueFloor,
    evidenceFloor: body.evidenceFloor,
    metricHint: typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
