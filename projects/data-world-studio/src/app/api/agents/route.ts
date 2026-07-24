import { guard, json } from "@/lib/api";
import { createAgent, listAgents } from "@/store";
import type { AgentStyle } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const workspaceId = url.searchParams.get("workspaceId") ?? undefined;
  return json({ items: listAgents(workspaceId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    workspaceId?: string;
    name?: string;
    style?: AgentStyle;
    skill?: number;
    notes?: string;
  };
  if (!body.workspaceId || !body.name?.trim()) {
    return json({ error: "workspace_and_name_required" }, { status: 400 });
  }
  try {
    const agent = createAgent({
      workspaceId: body.workspaceId,
      name: body.name,
      style: body.style ?? "balanced",
      skill: body.skill ?? 0.7,
      notes: body.notes ?? "",
    });
    return json(agent, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
