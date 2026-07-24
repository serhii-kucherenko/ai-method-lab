import { guard, json } from "@/lib/api";
import { createDebate, listDebates } from "@/store";
import type { DebateStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const rulePackId = url.searchParams.get("rulePackId") ?? undefined;
  return json({ items: listDebates(rulePackId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    rulePackId?: string;
    name?: string;
    status?: DebateStatus;
    turnCount?: number;
    depth?: number;
    challengerPressure?: number;
    consensusStrength?: number;
    notes?: string;
  };
  if (!body.rulePackId || !body.name?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createDebate({
      rulePackId: body.rulePackId,
      name: body.name,
      status: body.status,
      turnCount: body.turnCount,
      depth: body.depth,
      challengerPressure: body.challengerPressure,
      consensusStrength: body.consensusStrength,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
