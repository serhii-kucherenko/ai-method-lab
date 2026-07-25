import { guard, json } from "@/lib/api";
import { listCompares, runCompare, type MemoryBias } from "@/store";

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
    name: String(body.name ?? "Route compare"),
    packId: String(body.packId ?? ""),
    routeId: String(body.routeId ?? ""),
    memoryBias: body.memoryBias as MemoryBias | undefined,
    localGreedyFit:
      body.localGreedyFit != null ? Number(body.localGreedyFit) : undefined,
    singleStepFluency:
      body.singleStepFluency != null
        ? Number(body.singleStepFluency)
        : undefined,
    deadEndPressure:
      body.deadEndPressure != null ? Number(body.deadEndPressure) : undefined,
    routeDrift: body.routeDrift != null ? Number(body.routeDrift) : undefined,
  });
  if (!compare) return json({ error: "missing_entities" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
