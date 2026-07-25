import { guard, json } from "@/lib/api";
import { createRun, listRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listRuns({
      sessionId: url.searchParams.get("sessionId") ?? undefined,
      wearerId: url.searchParams.get("wearerId") ?? undefined,
      observerId: url.searchParams.get("observerId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createRun({
    sessionId: body.sessionId ?? body.designId,
    wearerId: body.wearerId ?? body.alleleId,
    observerId: body.observerId,
    egoCoverage: Number(body.egoCoverage ?? body.peptideCoverage ?? 0.5),
    exoCoverage: Number(body.exoCoverage ?? body.alleleFidelity ?? 0.5),
    fusionClarity: Number(body.fusionClarity ?? body.hybridClarity ?? 0.5),
    packCompleteness: Number(body.packCompleteness ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
