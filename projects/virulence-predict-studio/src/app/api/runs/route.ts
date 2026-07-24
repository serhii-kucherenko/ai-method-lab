import { guard, json } from "@/lib/api";
import { advanceRun, createRun, exportRunsJson, listRuns, paginate } from "@/store";
import type { PredictInput, PredictMode, PredictProfile } from "@/domain/types";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  if (url.searchParams.get("export") === "json") {
    const panelId = url.searchParams.get("panelId") ?? undefined;
    return new Response(exportRunsJson(panelId), {
      headers: {
        "content-type": "application/json",
        "content-disposition": 'attachment; filename="prediction-runs.json"',
      },
    });
  }
  const panelId = url.searchParams.get("panelId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(paginate(listRuns(panelId), page, pageSize));
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = (await req.json()) as {
    panelId?: string;
    mode?: PredictMode;
    profile?: PredictProfile;
    proteinLabel?: string;
    predictInput?: Partial<PredictInput>;
    action?: "create" | "advance";
    runId?: string;
  };

  if (body.action === "advance") {
    if (!body.runId) return json({ error: "runId_required" }, { status: 400 });
    try {
      return json(advanceRun(body.runId));
    } catch (e) {
      return json(
        { error: e instanceof Error ? e.message : "advance_failed" },
        { status: 400 },
      );
    }
  }

  if (!body.panelId) return json({ error: "panelId_required" }, { status: 400 });
  try {
    const run = createRun({
      panelId: body.panelId,
      mode: body.mode,
      profile: body.profile,
      proteinLabel: body.proteinLabel,
      predictInput: body.predictInput,
    });
    return json(run, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "create_failed" },
      { status: 400 },
    );
  }
}
