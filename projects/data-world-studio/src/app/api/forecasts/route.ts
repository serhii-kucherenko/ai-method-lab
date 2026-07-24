import { guard, json } from "@/lib/api";
import {
  createForecast,
  exportForecastsJson,
  listForecasts,
  paginate,
} from "@/store";
import type { PlanProfile, ScoreMode } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "json") {
    const workspaceId = url.searchParams.get("workspaceId") ?? undefined;
    return new Response(exportForecastsJson(workspaceId), {
      headers: { "content-type": "application/json" },
    });
  }
  const operationId = url.searchParams.get("operationId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(paginate(listForecasts(operationId), page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    operationId?: string;
    name?: string;
    mode?: ScoreMode;
    profile?: PlanProfile;
    agentId?: string;
  };
  if (!body.operationId || !body.name?.trim()) {
    return json({ error: "operation_and_name_required" }, { status: 400 });
  }
  try {
    const forecast = createForecast({
      operationId: body.operationId,
      name: body.name,
      mode: body.mode,
      profile: body.profile,
      agentId: body.agentId,
    });
    return json(forecast, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
