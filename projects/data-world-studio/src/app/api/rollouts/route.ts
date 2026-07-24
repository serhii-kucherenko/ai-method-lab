import { guard, json } from "@/lib/api";
import { createRollout, listRollouts } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId") ?? undefined;
  return json({ items: listRollouts(workspaceId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    forecastId?: string;
    agentId?: string;
    label?: string;
  };
  if (!body.forecastId || !body.agentId) {
    return json({ error: "forecast_and_agent_required" }, { status: 400 });
  }
  try {
    const rollout = createRollout({
      forecastId: body.forecastId,
      agentId: body.agentId,
      label: body.label,
    });
    return json(rollout, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
