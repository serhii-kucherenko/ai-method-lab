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
    name: String(body.name ?? "Refresh compare"),
    packId: String(body.packId ?? ""),
    aerialId: String(body.aerialId ?? ""),
    planId: String(body.planId ?? ""),
    elevationChangeM:
      body.elevationChangeM != null ? Number(body.elevationChangeM) : undefined,
    slopeSteepness:
      body.slopeSteepness != null ? Number(body.slopeSteepness) : undefined,
    fuelDrift: body.fuelDrift != null ? Number(body.fuelDrift) : undefined,
  });
  if (!compare) return json({ error: "missing_entities" }, { status: 400 });
  return json({ compare }, { status: 201 });
}
