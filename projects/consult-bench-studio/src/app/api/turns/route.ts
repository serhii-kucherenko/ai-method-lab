import { guard, json } from "@/lib/api";
import { createTurn, listTurns } from "@/store";
import type { TurnStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const caseId = url.searchParams.get("caseId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listTurns(q, page, pageSize, caseId));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    caseId?: string;
    label?: string;
    status?: TurnStatus;
    patientText?: string;
    imageCaption?: string;
    hasImage?: boolean;
    imageRelevance?: number;
    visualGrounding?: number;
    turnIndex?: number;
    notes?: string;
  };
  if (!body.caseId || !body.label?.trim()) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createTurn(body as { caseId: string; label: string });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
