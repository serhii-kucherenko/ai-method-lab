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
    packId: body.packId,
    scenarioId: body.scenarioId,
    speciesId: body.speciesId,
    populationId: body.populationId,
    climateBias: body.climateBias ?? body.bias,
    overclaimRisk: body.overclaimRisk,
    vectorNicheFidelity: body.vectorNicheFidelity,
    spatialCoverage: body.spatialCoverage,
    historicalStickiness: body.historicalStickiness,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
