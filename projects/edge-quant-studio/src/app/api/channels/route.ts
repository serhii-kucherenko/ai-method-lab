import { guard, json } from "@/lib/api";
import {
  createChannelPlan,
  listChannelPlans,
  scoreChannelPlan,
} from "@/store";
import type { ChannelPlanStatus, QuantProfile } from "@/store";

export async function GET(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? undefined;
  const packId = url.searchParams.get("packId") ?? undefined;
  const page = Number(url.searchParams.get("page") ?? "1");
  const pageSize = Number(url.searchParams.get("pageSize") ?? "20");
  return json(listChannelPlans(q, page, pageSize, packId));
}

export async function POST(req: Request) {
  const denied = guard(req);
  if (denied) return denied;
  const body = (await req.json()) as {
    packId?: string;
    targetId?: string;
    name?: string;
    status?: ChannelPlanStatus;
    avgBitBudget?: number;
    saliencySkew?: number;
    activationEnergy?: number;
    paletteSpan?: number;
    clusterRegularity?: number;
    layoutMerge?: number;
    memoryHeadroom?: number;
    targetAffinity?: number;
    profile?: QuantProfile;
    notes?: string;
    score?: boolean;
  };
  if (!body.name?.trim() || !body.packId || !body.targetId) {
    return json({ error: "invalid_body" }, { status: 400 });
  }
  try {
    let item = createChannelPlan({
      packId: body.packId,
      targetId: body.targetId,
      name: body.name,
      status: body.status,
      avgBitBudget: body.avgBitBudget,
      saliencySkew: body.saliencySkew,
      activationEnergy: body.activationEnergy,
      paletteSpan: body.paletteSpan,
      clusterRegularity: body.clusterRegularity,
      layoutMerge: body.layoutMerge,
      memoryHeadroom: body.memoryHeadroom,
      targetAffinity: body.targetAffinity,
      profile: body.profile,
      notes: body.notes,
    });
    if (body.score !== false) {
      item = scoreChannelPlan(item.id);
    }
    return json({ item }, { status: 201 });
  } catch (e) {
    return json({ error: String(e) }, { status: 400 });
  }
}
