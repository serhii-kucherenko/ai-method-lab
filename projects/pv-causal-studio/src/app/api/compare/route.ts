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
    exposureId: body.exposureId,
    cohortId: body.cohortId,
    runId: body.runId,
    signalBias: body.signalBias ?? body.bias,
    spontaneousVolume: body.spontaneousVolume,
    tipLineOptimism: body.tipLineOptimism,
    trialHardness: body.trialHardness,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
