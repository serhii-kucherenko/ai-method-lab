import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  return json({ items: listCompares() });
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const compare = runCompare({
    name: body.name ?? "compare",
    packId: body.packId,
    badgeId: body.badgeId,
    feedId: body.feedId,
    topicId: body.topicId,
    dialogueRunId: body.dialogueRunId,
    dialogueBias: body.dialogueBias ?? body.bias,
    engagementPull: body.engagementPull,
    outrageTunnel: body.outrageTunnel,
    feedNoise: body.feedNoise,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
