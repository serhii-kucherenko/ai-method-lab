import { guard, json } from "@/lib/api";
import { createScore, listScores } from "@/store";
import type { GameScoreStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const rulePackId = url.searchParams.get("rulePackId") ?? undefined;
  return json({ items: listScores(rulePackId, q) });
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    rulePackId?: string;
    debateId?: string;
    name?: string;
    status?: GameScoreStatus;
    bayesianUpdate?: number;
    teamCoordination?: number;
    evidenceGrounding?: number;
    notes?: string;
  };
  if (!body.rulePackId || !body.debateId || !body.name?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createScore({
      rulePackId: body.rulePackId,
      debateId: body.debateId,
      name: body.name,
      status: body.status,
      bayesianUpdate: body.bayesianUpdate,
      teamCoordination: body.teamCoordination,
      evidenceGrounding: body.evidenceGrounding,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
