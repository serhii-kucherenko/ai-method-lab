import { guard, json } from "@/lib/api";
import { createRun, listRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listRuns({
      designId: url.searchParams.get("designId") ?? undefined,
      alleleId: url.searchParams.get("alleleId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const run = createRun({
    designId: body.designId ?? body.onsetId,
    alleleId: body.alleleId ?? body.regimenId,
    peptideCoverage: Number(body.peptideCoverage ?? body.onsetCoverage ?? 0.5),
    alleleFidelity: Number(body.alleleFidelity ?? body.regimenFidelity ?? 0.5),
    hybridClarity: Number(body.hybridClarity ?? body.hmmStateClarity ?? 0.5),
    packCompleteness: Number(body.packCompleteness ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "invalid_refs" }, { status: 400 });
  return json({ run }, { status: 201 });
}
