import { guard, json } from "@/lib/api";
import { createOperation, listOperations, paginate } from "@/store";
import type { OpKind } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const workspaceId = url.searchParams.get("workspaceId") ?? undefined;
  const maxCostRaw = url.searchParams.get("maxCost");
  const maxCost = maxCostRaw ? Number(maxCostRaw) : undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10");
  return json(
    paginate(listOperations(workspaceId, q, maxCost), page, pageSize),
  );
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    workspaceId?: string;
    name?: string;
    kind?: OpKind;
    estimatedCost?: number;
    complexity?: number;
    notes?: string;
  };
  if (!body.workspaceId || !body.name?.trim()) {
    return json({ error: "workspace_and_name_required" }, { status: 400 });
  }
  try {
    const operation = createOperation({
      workspaceId: body.workspaceId,
      name: body.name,
      kind: body.kind ?? "model-fit",
      estimatedCost: body.estimatedCost ?? 20,
      complexity: body.complexity ?? 0.5,
      notes: body.notes ?? "",
    });
    return json(operation, { status: 201 });
  } catch (e) {
    return json(
      { error: e instanceof Error ? e.message : "error" },
      { status: 400 },
    );
  }
}
