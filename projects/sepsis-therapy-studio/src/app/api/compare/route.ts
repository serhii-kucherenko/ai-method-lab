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
    onsetId: body.onsetId ?? body.exposureId,
    regimenId: body.regimenId ?? body.cohortId,
    runId: body.runId,
    therapyBias: body.therapyBias ?? body.signalBias ?? body.bias,
    guidelineAdherence: body.guidelineAdherence ?? body.spontaneousVolume,
    cultureLagOptimism: body.cultureLagOptimism ?? body.tipLineOptimism,
    sepsisHardness: body.sepsisHardness ?? body.trialHardness,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
