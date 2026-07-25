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
    name: body.name ?? "DELT compare",
    packId: body.packId ?? "pack-demo",
    libraryId: body.libraryId ?? "library-demo",
    cycleId: body.cycleId ?? "cycle-demo",
    hitId: body.hitId ?? "hit-demo",
    assayRunId: body.assayRunId ?? "assay-demo",
    deltBias: body.deltBias ?? body.bias,
    libraryCoverage: body.libraryCoverage,
    selectionBias: body.selectionBias,
    synthesisNoise: body.synthesisNoise,
    overclaimRisk: body.overclaimRisk,
  });
  if (!compare) return json({ error: "bad_refs" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
