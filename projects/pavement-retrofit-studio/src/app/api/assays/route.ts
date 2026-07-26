import { guard, json } from "@/lib/api";
import { createAssay, listAssays, type AssayKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listAssays({
      packId: url.searchParams.get("packId") ?? undefined,
      corridorId: url.searchParams.get("corridorId") ?? undefined,
      treatmentId: url.searchParams.get("treatmentId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? "1"),
      pageSize: Number(url.searchParams.get("pageSize") ?? "20"),
    }),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as Record<string, unknown>;
  if (
    typeof body.packId !== "string" ||
    typeof body.corridorId !== "string" ||
    typeof body.treatmentId !== "string" ||
    typeof body.label !== "string" ||
    typeof body.kind !== "string" ||
    typeof body.noxBaseline !== "number" ||
    typeof body.co2Baseline !== "number" ||
    typeof body.tio2Loading !== "number" ||
    typeof body.assaySignal !== "number"
  ) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  const row = createAssay({
    packId: body.packId,
    corridorId: body.corridorId,
    treatmentId: body.treatmentId,
    label: body.label,
    kind: body.kind as AssayKind,
    noxBaseline: body.noxBaseline,
    co2Baseline: body.co2Baseline,
    tio2Loading: body.tio2Loading,
    assaySignal: body.assaySignal,
    runNotes: typeof body.runNotes === "string" ? body.runNotes : undefined,
  });
  if (!row) return json({ error: "deps_not_found" }, { status: 404 });
  return json(row);
}
