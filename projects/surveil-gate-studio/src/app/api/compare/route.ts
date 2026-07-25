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
    signalId: body.signalId ?? body.sessionId,
    pillarId: body.pillarId ?? body.wearerId,
    policyId: body.policyId ?? body.observerId,
    auditId: body.auditId ?? body.runId,
    governanceBias: body.governanceBias ?? body.motionBias ?? body.bias,
    explainOnlyAdherence:
      body.explainOnlyAdherence ?? body.egoOnlyAdherence,
    trustErosionRisk: body.trustErosionRisk ?? body.driftRisk,
    hallucinationHardness:
      body.hallucinationHardness ?? body.occlusionHardness,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
