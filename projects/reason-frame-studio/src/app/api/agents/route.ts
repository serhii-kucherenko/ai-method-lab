import { guard, json } from "@/lib/api";
import { createAgent, listAgents } from "@/store";
import type { AgentRole } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  return json({ items: listAgents(q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    name?: string;
    role?: AgentRole;
    temperature?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.role) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createAgent({
      name: body.name,
      role: body.role,
      temperature: body.temperature,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
