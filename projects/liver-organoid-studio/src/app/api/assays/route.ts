import { guard, json } from "@/lib/api";
import { createAssayRun, listAssayRuns } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listAssayRuns({
      packId: url.searchParams.get("packId") ?? undefined,
      modelId: url.searchParams.get("modelId") ?? undefined,
      lineageId: url.searchParams.get("lineageId") ?? undefined,
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
    packId: body.packId ?? "pack-demo",
    modelId: body.modelId ?? "model-demo",
    lineageId: body.lineageId ?? "lineage-demo",
    label: body.label ?? "Assay soft-sim",
    kind: body.kind ?? "differentiation_day",
    multicellularComplexity: Number(body.multicellularComplexity ?? 0.6),
    hepatocyteLikeFidelity: Number(body.hepatocyteLikeFidelity ?? 0.65),
    differentiationDay: Number(body.differentiationDay ?? 0.7),
    runNotes: body.runNotes,
  });
  if (!run) return json({ error: "bad_refs" }, { status: 400 });
  return json({ assay: run }, { status: 201 });
}
