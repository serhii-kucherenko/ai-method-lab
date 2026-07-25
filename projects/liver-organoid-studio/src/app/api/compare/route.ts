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
    name: body.name ?? "Seed organoid compare",
    packId: body.packId ?? "pack-demo",
    modelId: body.modelId ?? "model-demo",
    lineageId: body.lineageId ?? "lineage-demo",
    assayRunId: body.assayRunId ?? "assay-demo",
    masldCaseId: body.masldCaseId ?? "masld-demo",
    lineageBias: body.lineageBias ?? body.bias,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
