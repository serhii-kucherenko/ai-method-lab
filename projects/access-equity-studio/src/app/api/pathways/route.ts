import { guard, json } from "@/lib/api";
import { archivePathway, createPathway, listPathways } from "@/store";
import type { PathwayStage } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(listPathways({
    q: url.searchParams.get("q") ?? undefined,
    packId: url.searchParams.get("packId") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    page: Number(url.searchParams.get("page") ?? 1),
    pageSize: Number(url.searchParams.get("pageSize") ?? 20),
  }));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  if (body.action === "archive") {
    const pathway = archivePathway(body.id);
    if (!pathway) return json({ error: "not_found" }, { status: 404 });
    return json({ pathway });
  }
  const pathway = createPathway({
    packId: body.packId,
    label: body.label,
    stage: body.stage as PathwayStage,
    referralHint: body.referralHint ?? "",
    stepCount: Number(body.stepCount ?? 3),
    waitDaysFloor: Number(body.waitDaysFloor ?? 7),
    metricHint: body.metricHint,
    notes: body.notes,
  });
  if (!pathway) return json({ error: "pack_not_found" }, { status: 400 });
  return json({ pathway }, { status: 201 });
}
