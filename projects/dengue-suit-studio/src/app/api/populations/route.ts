import { guard, json } from "@/lib/api";
import { createPopulation, listPopulations } from "@/store";

export async function GET(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const url = new URL(req.url);
  return json(
    listPopulations({
      packId: url.searchParams.get("packId") ?? undefined,
      scenarioId: url.searchParams.get("scenarioId") ?? undefined,
      speciesId: url.searchParams.get("speciesId") ?? undefined,
      page: Number(url.searchParams.get("page") ?? 1),
      pageSize: Number(url.searchParams.get("pageSize") ?? 20),
    }),
  );
}

export async function POST(req: Request) {
  const blocked = guard(req);
  if (blocked) return blocked;
  const body = await req.json();
  const population = createPopulation({
    packId: body.packId,
    scenarioId: body.scenarioId,
    speciesId: body.speciesId,
    label: body.label,
    kind: body.kind,
    thermalSuitIndex: Number(body.thermalSuitIndex ?? 0.5),
    populationAtRisk: Number(body.populationAtRisk ?? 0.5),
    climateShiftSignal: Number(body.climateShiftSignal ?? 0.5),
    assaySignal: Number(body.assaySignal ?? 0.5),
    runNotes: body.runNotes,
  });
  if (!population) return json({ error: "bad_refs" }, { status: 400 });
  return json({ population }, { status: 201 });
}
