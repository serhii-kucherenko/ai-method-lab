import { guard, json } from "@/lib/api";
import { createRun, listRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listRuns({
      onsetId: url.searchParams.get("onsetId") ?? undefined,
      regimenId: url.searchParams.get("regimenId") ?? undefined,
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
    onsetId: body.onsetId ?? body.exposureId,
    regimenId: body.regimenId ?? body.cohortId,
    onsetCoverage: Number(body.onsetCoverage ?? body.cohortCoverage ?? 0.5),
    regimenFidelity: Number(
      body.regimenFidelity ?? body.exposureFidelity ?? 0.5,
    ),
    hmmStateClarity: Number(
      body.hmmStateClarity ?? body.confounderControl ?? 0.5,
    ),
    packCompleteness: Number(body.packCompleteness ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
