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
    name: body.name ?? "Seed hydrogel compare",
    packId: body.packId ?? "pack-demo",
    gelId: body.gelId ?? "gel-demo",
    chargeId: body.chargeId ?? "charge-demo",
    saltId: body.saltId ?? "salt-demo",
    assayRunId: body.assayRunId ?? "assay-demo",
    chargeBias: body.chargeBias ?? body.bias,
    fixedChargeDensity: body.fixedChargeDensity,
    saltLoad: body.saltLoad,
    bindingStrength: body.bindingStrength,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
