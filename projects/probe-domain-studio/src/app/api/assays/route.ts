import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      probeId: url.searchParams.get("probeId") ?? undefined,
      domainId: url.searchParams.get("domainId") ?? undefined,
      targetId: url.searchParams.get("targetId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createAssayRun({
    packId: body.packId,
    probeId: body.probeId,
    domainId: body.domainId,
    targetId: body.targetId,
    cooperativity: Number(body.cooperativity ?? 0.5),
    domainCoverage: Number(body.domainCoverage ?? 0.5),
    bridgeCompleteness: Number(body.bridgeCompleteness ?? 0.5),
    specificityDelta: Number(body.specificityDelta ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "refs_not_found" }, { status: 400 });
  return json({ assay: run }, { status: 201 });
}
