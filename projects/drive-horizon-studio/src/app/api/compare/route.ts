import { guard, json } from "@/lib/api";
import { listCompares, runCompare } from "@/store";
import type { HorizonBias } from "@/store";

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
    name: String(body.name ?? "Horizon compare"),
    sceneId: String(body.sceneId ?? ""),
    generatorId: String(body.generatorId ?? ""),
    horizonBias: body.horizonBias as HorizonBias | undefined,
    rolloutSmoothness:
      body.rolloutSmoothness != null ? Number(body.rolloutSmoothness) : undefined,
    fluencyScore:
      body.fluencyScore != null ? Number(body.fluencyScore) : undefined,
    surprisePressure:
      body.surprisePressure != null ? Number(body.surprisePressure) : undefined,
    horizonDrift:
      body.horizonDrift != null ? Number(body.horizonDrift) : undefined,
  });
  if (!compare) return json({ error: "missing_entities" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
