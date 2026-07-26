import { guard, json } from "@/lib/api";
import {
  archiveTreatment,
  createTreatment,
  listTreatments,
  type TreatmentKind,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listTreatments({
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
    const row = archiveTreatment(body.id);
    if (!row) return json({ error: "not_found" }, { status: 404 });
    return json(row);
  }
  if (
    typeof body.packId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.materialHint !== "string" ||
    typeof body.tio2Floor !== "number" ||
    typeof body.durabilityFloor !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createTreatment({
    packId: body.packId,
    label: body.label,
    kind: body.kind as TreatmentKind,
    materialHint: body.materialHint,
    tio2Floor: body.tio2Floor,
    durabilityFloor: body.durabilityFloor,
    metricHint:
      typeof body.metricHint === "string" ? body.metricHint : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  });
  if (!row) return json({ error: "pack_not_found" }, { status: 404 });
  return json(row);
}
