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
    name: body.name,
    sessionId: body.sessionId ?? body.designId,
    wearerId: body.wearerId ?? body.alleleId,
    observerId: body.observerId,
    runId: body.runId,
    motionBias: body.motionBias ?? body.designBias ?? body.bias,
    egoOnlyAdherence: body.egoOnlyAdherence ?? body.classicalAdherence,
    driftRisk: body.driftRisk ?? body.generativeOptimism,
    occlusionHardness: body.occlusionHardness ?? body.designHardness,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
