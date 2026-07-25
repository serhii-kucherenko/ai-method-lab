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
    designId: body.designId ?? body.onsetId,
    alleleId: body.alleleId ?? body.regimenId,
    runId: body.runId,
    designBias: body.designBias ?? body.therapyBias ?? body.bias,
    classicalAdherence: body.classicalAdherence ?? body.guidelineAdherence,
    generativeOptimism: body.generativeOptimism ?? body.cultureLagOptimism,
    designHardness: body.designHardness ?? body.sepsisHardness,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
