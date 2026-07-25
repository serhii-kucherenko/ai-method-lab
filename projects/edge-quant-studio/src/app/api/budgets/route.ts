import { guard, json } from "@/lib/api";
import { createBudget, listBudgets } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listBudgets(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    targetId?: string;
    name?: string;
    weightMb?: number;
    kvMb?: number;
    activationMb?: number;
    headroomMb?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.targetId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createBudget({
      targetId: body.targetId,
      name: body.name,
      weightMb: body.weightMb,
      kvMb: body.kvMb,
      activationMb: body.activationMb,
      headroomMb: body.headroomMb,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
