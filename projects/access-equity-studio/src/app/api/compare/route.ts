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
    equityGateId: body.equityGateId,
    cohortId: body.cohortId,
    screenId: body.screenId,
    pathwayId: body.pathwayId,
    accessRunId: body.accessRunId,
    equityBias: body.equityBias ?? body.bias,
    accuracyAdherence: body.accuracyAdherence,
    accuracyTunnel: body.accuracyTunnel,
    screenNoise: body.screenNoise,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
