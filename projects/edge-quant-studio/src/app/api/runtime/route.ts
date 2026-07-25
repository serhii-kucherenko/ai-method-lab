import { guard, json } from "@/lib/api";
import { createRuntimePlan, listRuntimePlans } from "@/store";
import type { RuntimePlanStatus } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listRuntimePlans(q, page, pageSize));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    channelPlanId?: string;
    name?: string;
    status?: RuntimePlanStatus;
    clusterBlocks?: number;
    kernelPaths?: number;
    reorderTrafficPct?: number;
    notes?: string;
  };
  if (!body.name?.trim() || !body.channelPlanId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    const item = createRuntimePlan({
      channelPlanId: body.channelPlanId,
      name: body.name,
      status: body.status,
      clusterBlocks: body.clusterBlocks,
      kernelPaths: body.kernelPaths,
      reorderTrafficPct: body.reorderTrafficPct,
      notes: body.notes,
    });
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
