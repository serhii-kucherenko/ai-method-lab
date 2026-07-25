import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      libraryId: url.searchParams.get("libraryId") ?? undefined,
      cycleId: url.searchParams.get("cycleId") ?? undefined,
      hitId: url.searchParams.get("hitId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const assay = createAssayRun({
    packId: body.packId,
    libraryId: body.libraryId,
    cycleId: body.cycleId,
    hitId: body.hitId,
    cycleDepth: Number(body.cycleDepth ?? 0.5),
    enrichmentFold: Number(body.enrichmentFold ?? 0.5),
    diversityRetention: Number(body.diversityRetention ?? 0.5),
    hitPrecision: Number(body.hitPrecision ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!assay) return json({ error: "bad_refs" }, { status: 400 });
  return json({ assay }, { status: 201 });
}
