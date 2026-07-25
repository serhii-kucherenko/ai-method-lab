import { guard, json } from "@/lib/api";
import { createScore, listScores, scoreConsult } from "@/store";
import type { ConsultInput, ScoreStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listScores(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    caseId?: string;
    turnId?: string;
    name?: string;
    status?: ScoreStatus;
    clinicalCoherence?: number;
    safetyDiscipline?: number;
    turnClarity?: number;
    notes?: string;
    preview?: ConsultInput;
  };
  if (body.preview) {
    return json(scoreConsult(body.preview));
  }
  if (!body.caseId || !body.turnId || !body.name?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createScore(body as { caseId: string; turnId: string; name: string });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
