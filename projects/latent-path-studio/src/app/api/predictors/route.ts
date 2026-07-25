import { guard, json } from "@/lib/api";
import { archivePredictor, createPredictor, listPredictors } from "@/store";
import type { PredictorKind } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPredictors({
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
    const predictor = archivePredictor(body.id);
    if (!predictor) return json({ error: "not_found" }, { status: 404 });
    return json({ predictor });
  }
  const predictor = createPredictor({
    packId: body.packId,
    label: body.label,
    kind: body.kind as PredictorKind,
    fidelityHint: body.fidelityHint ?? "",
    featureCount: Number(body.featureCount ?? 1),
    severityFloor: Number(body.severityFloor ?? 0.3),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!predictor) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ predictor }, { status: 201 });
}
