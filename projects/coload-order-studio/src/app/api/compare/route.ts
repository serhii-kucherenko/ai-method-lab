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
    carrierId: body.carrierId,
    loadId: body.loadId,
    assayRunId: body.assayRunId,
    loadBias: body.loadBias ?? body.bias,
    overclaimRisk: body.overclaimRisk,
    poreFillUniformity: body.poreFillUniformity,
    photothermalResponse: body.photothermalResponse,
    burstLeakRisk: body.burstLeakRisk,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
