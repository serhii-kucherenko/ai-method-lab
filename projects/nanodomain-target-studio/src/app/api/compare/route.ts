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
    name: body.name ?? "Nanodomain compare",
    packId: body.packId ?? "pack-demo",
    nanodomainId: body.nanodomainId ?? "nanodomain-demo",
    peptideId: body.peptideId ?? "peptide-demo",
    assayRunId: body.assayRunId ?? "assay-demo",
    targetBias: body.targetBias ?? body.bias,
    overclaimRisk: body.overclaimRisk,
    diastolicGain: body.diastolicGain,
    systolicPreserve: body.systolicPreserve,
    systemicSpillover: body.systemicSpillover,
    phosphorylationCoverage: body.phosphorylationCoverage,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
