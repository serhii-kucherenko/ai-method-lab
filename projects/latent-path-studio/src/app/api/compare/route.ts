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
    outcomeId: body.outcomeId,
    cohortId: body.cohortId,
    predictorId: body.predictorId,
    trajectoryId: body.trajectoryId,
    pathBias: body.pathBias ?? body.bias,
    singleDomainAdherence: body.singleDomainAdherence,
    domainIsolation: body.domainIsolation,
    predictorNoise: body.predictorNoise,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
