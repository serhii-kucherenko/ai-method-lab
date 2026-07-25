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
    probeId: body.probeId,
    domainId: body.domainId,
    targetId: body.targetId,
    assayRunId: body.assayRunId,
    probeBias: body.probeBias ?? body.bias,
    meltingSharpness: body.meltingSharpness,
    incompleteRisk: body.incompleteRisk,
    physioNoise: body.physioNoise,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
