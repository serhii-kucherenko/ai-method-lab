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
    name: body.name ?? "Seed fluoride compare",
    packId: body.packId ?? "pack-demo",
    precursorId: body.precursorId ?? "precursor-demo",
    exchangeId: body.exchangeId ?? "exchange-demo",
    tracerId: body.tracerId ?? "tracer-demo",
    assayRunId: body.assayRunId ?? "assay-demo",
    labelBias: body.labelBias ?? body.bias,
    prostheticStepBurden: body.prostheticStepBurden,
    solventHarshness: body.solventHarshness,
    activationBarrier: body.activationBarrier,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
