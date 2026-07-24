import { guard, json } from "@/lib/api";
import {
  createAgent,
  listAgents,
  setAgentActive,
} from "@/store";
import type { AgentRoleKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const domainId = url.searchParams.get("domainId") ?? undefined;
  return json({ items: listAgents(domainId) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    domainId?: string;
    name?: string;
    kind?: AgentRoleKind;
    specialization?: number;
    active?: boolean;
    agentId?: string;
    toggleActive?: boolean;
  };
  try {
    if (body.agentId != null && body.toggleActive != null) {
      return json(setAgentActive(body.agentId, body.toggleActive));
    }
    if (!body.domainId || !body.name?.trim() || !body.kind) {
      return json({ error: "domain_name_kind_required" }, { status: 400 });
    }
    const agent = createAgent({
      domainId: body.domainId,
      name: body.name,
      kind: body.kind,
      specialization: body.specialization ?? 0.6,
      active: body.active,
    });
    return json(agent, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }
}
