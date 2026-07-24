import { guard, json } from "@/lib/api";
import {
  createOptimizePass,
  listOptimizePasses,
  type OptimizeStatus,
} from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  return json(
    listOptimizePasses(
      url.searchParams.get("candidateId") ?? undefined,
      url.searchParams.get("q") ?? undefined,
    ),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    candidateId?: string;
    name?: string;
    status?: OptimizeStatus;
    propertyWeight?: number;
    notes?: string;
  };
  if (!body.candidateId || !body.name) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    return json(
      createOptimizePass({
        candidateId: body.candidateId,
        name: body.name,
        status: body.status,
        propertyWeight: body.propertyWeight,
        notes: body.notes,
      }),
      { status: 201 },
    );
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
