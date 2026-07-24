import { guard, json } from "@/lib/api";
import { createFlag, listFlags, resolveFlag } from "@/store";
import type { FlagSeverity, FlagStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const rulePackId = url.searchParams.get("rulePackId") ?? undefined;
  return json({ items: listFlags(rulePackId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    rulePackId?: string;
    debateId?: string;
    name?: string;
    severity?: FlagSeverity;
    status?: FlagStatus;
    fluencyBias?: number;
    contradictionRate?: number;
    notes?: string;
    id?: string;
    resolve?: boolean;
  };
  if (body.resolve && body.id) {
    try {
      const item = resolveFlag(body.id, body.status ?? "resolved");
      return json({ item });
    } catch (e) {
      return json({ error: String(e) }, { status: 400 });
    }
  }
  if (!body.rulePackId || !body.debateId || !body.name?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createFlag({
      rulePackId: body.rulePackId,
      debateId: body.debateId,
      name: body.name,
      severity: body.severity,
      status: body.status,
      fluencyBias: body.fluencyBias,
      contradictionRate: body.contradictionRate,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
